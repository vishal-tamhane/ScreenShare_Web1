const socket = io();
const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] }; //The STUN server helps devices find their public IP for NAT traversal.
const roomID = localStorage.getItem("roomID") || window.location.pathname.split("/")[2];
const isSender = localStorage.getItem("isSender") === "true";

// Join the room immediately
socket.emit("join-room", roomID);

// Global variables
let screenStream = null;        // For sender: the shared screen stream
const senderConnections = {};   // For sender: map receiver socket IDs to RTCPeerConnection objects
let receiverPC = null;          // For receiver: the RTCPeerConnection

// If sender, start capturing the screen
if (isSender) {
  startScreenSharing();
}

/**
 * Sender: Capture screen and store the stream.
 */
async function startScreenSharing() {
  try {
    screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
    const videoElem = document.getElementById("video");
    if (videoElem) videoElem.srcObject = screenStream;
  } catch (err) {
    console.error("Error capturing screen:", err);
  }
}

/**
 * Sender: When a new receiver connects, create a new RTCPeerConnection,
 * attach the screen stream tracks, and send an offer.
 */
socket.on("user-connected", (receiverId) => {
  if (!isSender) return;
  console.log("New receiver connected:", receiverId);
  
  const pc = new RTCPeerConnection(config);
  senderConnections[receiverId] = pc;

  // Add screen tracks to this connection
  if (screenStream) {
    screenStream.getTracks().forEach(track => pc.addTrack(track, screenStream));
  } else {
    console.error("Screen stream not available");
  }

  // Send ICE candidates to the receiver
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", { roomID, candidate: event.candidate, receiverId });
    }
  };

  // Create and send an offer to the new receiver
  pc.createOffer()
    .then(offer => pc.setLocalDescription(offer))
    .then(() => {
      socket.emit("offer", { roomID, offer: pc.localDescription, receiverId });
    })
    .catch(err => console.error("Error creating offer for receiver", receiverId, err));
});

/**
 * Sender: Handle answer received from a receiver.
 */
socket.on("answer", ({ answer, receiverId }) => {
  if (!isSender) return;
  const pc = senderConnections[receiverId];
  if (pc) {
    pc.setRemoteDescription(new RTCSessionDescription(answer))
      .catch(err => console.error("Error setting remote description on sender side:", err));
  }
});

/**
 * Sender: Handle ICE candidate from a receiver.
 */
socket.on("ice-candidate", ({ candidate, receiverId }) => {
  if (!isSender) return;
  const pc = senderConnections[receiverId];
  if (pc) {
    pc.addIceCandidate(new RTCIceCandidate(candidate))
      .catch(err => console.error("Error adding ICE candidate on sender side:", err));
  }
});

/**
 * Receiver: When an offer is received, create a new RTCPeerConnection,
 * set the remote description, create an answer, and send it.
 */
socket.on("offer", async ({ offer, receiverId }) => {
  if (isSender) return; // Sender ignores offers.
  console.log("Receiver got an offer");

  receiverPC = new RTCPeerConnection(config);

  receiverPC.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", { roomID, candidate: event.candidate });
    }
  };

  receiverPC.ontrack = (event) => {
    const videoElem = document.getElementById("video");
    if (videoElem) {
      videoElem.srcObject = event.streams[0];
      document.getElementById("status").innerText = "Screen sharing is live!";
    }
  };

  try {
    await receiverPC.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await receiverPC.createAnswer();
    await receiverPC.setLocalDescription(answer);
    socket.emit("answer", { roomID, answer, receiverId: socket.id });
  } catch (err) {
    console.error("Error handling offer on receiver side:", err);
  }
});

/**
 * Receiver: Handle ICE candidate from the sender.
 */
socket.on("ice-candidate", async ({ candidate }) => {
  if (isSender) return;
  if (receiverPC) {
    try {
      await receiverPC.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error("Error adding ICE candidate on receiver side:", err);
    }
  }
});
