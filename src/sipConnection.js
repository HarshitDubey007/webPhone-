import React, { useState, useEffect } from 'react';
import { UserAgent as UA } from "sip.js/lib/api";

const Softphone = () => {
  const [userAgent, setUserAgent] = useState(null);
  const [destination, setDestination] = useState('');
  const [callStatus, setCallStatus] = useState('');

  useEffect(() => {
    const config = {
      uri: 'sip:username@domain.com',
      transportOptions: {
        wsServers: ['wss://your-sip-server-uri'],
      },
      authorizationUser: 'username',
      password: 'password',
    };

    const ua = new UA(config);
    ua.start();
    setUserAgent(ua);

    return () => {
      ua.stop();
    };
  }, []);

  const makeCall = () => {
    const session = userAgent.invite(`sip:${destination}@domain.com`);
    session.on('accepted', () => {
      setCallStatus('Call accepted');
    });
    session.on('terminated', () => {
      setCallStatus('Call terminated');
    });
  };

  useEffect(() => {
    if (userAgent) {
      userAgent.on('invite', (incomingSession) => {
        incomingSession.accept();
        setCallStatus('Incoming call');
      });
    }
  }, [userAgent]);

  return (
    <div>
      <h1>Softphone</h1>
      <input
        type="text"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        placeholder="Enter destination"
      />
      <button onClick={makeCall}>Make Call</button>
      <div>{callStatus}</div>
    </div>
  );
};

export default Softphone;







// Please note the following changes:

// The UserAgent is now imported directly from sip.js.
// The Inviter class is used to create outgoing calls.
// The SessionState enum is used to handle the different states of a call.
// The authorizationUsername and authorizationPassword fields are used in the configuration instead of authorizationUser and password.
// The UserAgent.makeURI static method is used to create a URI for the target.
// The stateChange event listener is used to listen for changes in the call state.
// The delegate property on the UserAgent is used to handle incoming calls.






// To implement calling, call end, mute/unmute, hold/unhold features in a React application using sip.js with Asterisk, you’ll need to use the sip.js library to handle SIP operations and manage the call states. Here’s a high-level overview of how you can implement these features:

// Calling: Use the Inviter class to create and send an INVITE request to initiate a call.
// Call End: Use the Session methods to terminate an active call.
// Mute/Unmute: Control the audio track of the local media stream to mute or unmute the call.
// Hold/Unhold: Send a re-INVITE with the appropriate SDP to put the call on hold or take it off hold.
// Here’s a simplified example of how you might implement these features:

// import React, { useState, useEffect } from 'react';
// import { UserAgent, Inviter, SessionState } from "sip.js";

// const Softphone = () => {
//   const [userAgent, setUserAgent] = useState(null);
//   const [session, setSession] = useState(null);

//   // Initialize the UserAgent with your Asterisk server configuration
//   useEffect(() => {
//     const config = {
//       // ... your configuration here
//     };
//     const ua = new UserAgent(config);
//     ua.start();
//     setUserAgent(ua);

//     return () => {
//       ua.stop();
//     };
//   }, []);

//   // Make a call
//   const makeCall = (destination) => {
//     if (userAgent) {
//       const target = UserAgent.makeURI(`sip:${destination}@your-asterisk-domain`);
//       if (target) {
//         const inviter = new Inviter(userAgent, target);
//         inviter.invite();
//         setSession(inviter);
//       }
//     }
//   };

//   // End a call
//   const endCall = () => {
//     if (session) {
//       session.bye();
//       setSession(null);
//     }
//   };

//   // Mute/Unmute
//   const toggleMute = () => {
//     if (session) {
//       const localStream = session.sessionDescriptionHandler.localMediaStream;
//       localStream.getAudioTracks().forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//     }
//   };

//   // Hold/Unhold
//   const toggleHold = async () => {
//     if (session) {
//       if (session.state === SessionState.Held) {
//         await session.unhold();
//       } else {
//         await session.hold();
//       }
//     }
//   };

//   // ... rest of your component
// };



// Please note that this is a high-level example and does not include all the necessary error handling, event listeners, and UI elements you would need for a complete application.

// For a more detailed implementation, you would need to:

// Configure your Asterisk server to work with sip.js.
// Handle different call events and states.
// Implement a user interface to interact with these functions.
// You can find more information and examples in the sip.js documentation1 and explore how to integrate it with Asterisk for advanced call control features. Remember to also consult the Asterisk documentation for specific configurations required on the server side to support these operations.