import React, { useState, useRef, useEffect } from "react";
import { FaPaperclip, FaSmile, FaTimes } from "react-icons/fa";

const MessageInput = ({ sendMessage,setMessages,activeUser,authToken }) => {
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEmojiOptions, setShowEmojiOptions] = useState(false);
  const fileInputRef = useRef(null);
  // const mediaRecorderRef = useRef(null);
  // const chunksRef = useRef([]);
  const handleRemoveAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };
  

  useEffect(() => {
    function handleClickOutside(event) {
      if (showEmojiOptions && !event.target.closest(".emoji-picker")) {
        setShowEmojiOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiOptions]);
  const [attachments, setAttachments] = useState([]); // Add attachments state
// const [activeUser, setActiveUser] = useState({ conversationId: 1 }); 

const handleSendMessage = () => {
  if (!newMessage.trim() && attachments.length === 0) {
    console.warn("Cannot send empty message.");
    return;
  }

  sendMessage(newMessage, attachments);
  setNewMessage("");
  setAttachments([]);
};

const handleFileChange = (event) => {
  const files = Array.from(event.target.files); // Handle multiple file uploads
  files.forEach((file) => {
    // Check if the file is an allowed type
    if (file.type.startsWith('image/') || file.type === 'application/pdf' || file.type === 'application/msword' || file.type.startsWith('application/vnd.openxmlformats-officedocument')) {
      setAttachments((prev) => [...prev, file]); // Add to attachments state
    } else {
      console.error('Selected file is not a supported type.');
      alert("Only images and document files (PDF, Word) are allowed.");
    }
  });
};


// const handleVoiceMessage = async () => {
//   if (!navigator.mediaDevices?.getUserMedia) {
//     console.error('getUserMedia not supported on your browser!');
//     return;
//   }

//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     mediaRecorderRef.current = new MediaRecorder(stream);
//     chunksRef.current = [];

//     mediaRecorderRef.current.ondataavailable = (event) => {
//       chunksRef.current.push(event.data);
//     };

//     mediaRecorderRef.current.onstop = () => {
//       const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
//       console.log('Audio Blob:', audioBlob);

//       const audioUrl = URL.createObjectURL(audioBlob);
//       console.log('Audio URL:', audioUrl);

//       try {
//         sendMessage(`[Voice message: ${audioUrl}]`); // Ensure sendMessage can handle a string
//       } catch (err) {
//         console.error('Error in sendMessage:', err);
//       }
//     };

//     mediaRecorderRef.current.start();
//     setTimeout(() => {
//       mediaRecorderRef.current.stop();
//     }, 3000); // 3-second recording

//   } catch (err) {
//     console.error('Error accessing audio devices.', err);
//   }
// };

const handleEmojiClick = (emoji) => {
  setNewMessage((prev) => prev + emoji);
  // No state toggle to prevent accidental close
};
const toggleEmojiPicker = () => {
  setShowEmojiOptions(!showEmojiOptions);
};

const removeSelectedImage = () => {
  setSelectedImage(null);
};

  return (
    <div className="flex flex-col bg-gray-800 p-3 rounded-lg">
      {selectedImage && (
        <div className="relative mb-2">
          <img
            src={selectedImage.previewUrl}
            alt="Selected "
            className="w-24 h-24 rounded mr-2 cursor-pointer"
          />
          <FaTimes
            className="text-white absolute top-0 right-0 mt-2 mr-2 cursor-pointer"
            onClick={removeSelectedImage}
          />
        </div>
      )}
      <div className="flex items-center relative">
        <FaSmile
          className="text-white mr-4 cursor-pointer"
          onClick={toggleEmojiPicker}
        />
        {showEmojiOptions && (
          <div className="absolute bottom-full left-0 bg-gray-700 p-2 rounded z-10 emoji-picker">
            <div className="flex flex-wrap">
              {/* Common emojis */}
              {["😊", "😂", "👍", "❤️", "🎉", "😍", "😎", "🙌", "🥳", "🔥"].map(
                (emoji) => (
                  <span
                    key={emoji}
                    className="cursor-pointer text-white text-2xl mr-2 mb-2"
                    onClick={() => handleEmojiClick(emoji)}
                  >
                    {emoji}
                  </span>
                )
              )}
              {/* East African flags */}
              {[
                "🇰🇪",
                "🇹🇿",
                "🇺🇬",
                "🇷🇼", // Removed 🇧🇮
              ].map((emoji) => (
                <span
                  key={emoji}
                  className="cursor-pointer text-white text-2xl mr-2 mb-2"
                  onClick={() => handleEmojiClick(emoji)}
                >
                  {emoji}
                </span>
              ))}
              {/* AGRIsoko related emojis */}
              {["🌾", "🚜", "🌱", "🍅", "🌽", "🍆"].map((emoji) => (
                <span
                  key={emoji}
                  className="cursor-pointer text-white text-2xl mr-2 mb-2"
                  onClick={() => handleEmojiClick(emoji)}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        )}
        <textarea
          placeholder="Type a message"
          className="bg-gray-800 text-white flex-1 outline-none resize-none border border-gray-600 p-2 rounded"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevent default send action
              handleSendMessage();
            } else if (e.key === "Enter" && e.shiftKey) {
              // Insert a newline character into the message
              setNewMessage(newMessage + "\n");
            }
          }}
        />
        <FaPaperclip
          className="text-white mx-4 cursor-pointer"
          onClick={() => fileInputRef.current.click()}
        />
        <div className="attachments-preview">
          {attachments.map((file, index) => (
            <div key={index} className="attachment-item">
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Uploaded preview"
                  className="w-24 h-24 rounded"
                />
              ) : (
                <div className="file-preview text-white">
                  <FaPaperclip className="inline mr-2" />
                  {file.name}
                </div>
              )}
              <FaTimes
                className="text-white cursor-pointer ml-2"
                onClick={() => handleRemoveAttachment(index)}
              />
            </div>
          ))}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileChange}
          aria-label="Upload attachments"
        />
        {/* <FaMicrophone
          className="text-white cursor-pointer ml-auto"
          onClick={handleVoiceMessage}
        /> */}
        <button onClick={handleSendMessage} className="text-white ml-4">
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageInput; 