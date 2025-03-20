const socket = io();
let peerConnection;
const config = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

const roomID = localStorage.getItem("roomID") || window.location.pathname.split("/")[2];

// Join Room
socket.emit("join-room", roomID);

// If sender, start sharing screen
async function startScreenSharing() {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });

    peerConnection = new RTCPeerConnection(config);
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit("ice-candidate", { roomID, candidate: event.candidate });
        }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("offer", { roomID, offer });

    document.getElementById("video").srcObject = stream;
}

// If receiver, wait for screen share
socket.on("offer", async (offer) => {
    peerConnection = new RTCPeerConnection(config);

    peerConnection.ontrack = (event) => {
        document.getElementById("video").srcObject = event.streams[0];
    };

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit("ice-candidate", { roomID, candidate: event.candidate });
        }
    };

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit("answer", { roomID, answer });
});

socket.on("answer", async (answer) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on("ice-candidate", async (candidate) => {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
});
