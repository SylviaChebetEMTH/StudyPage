
// import React, { useState, useRef, useEffect } from "react";
// import { FaPaperclip, FaSmile, FaTimes } from "react-icons/fa";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const MessageInput = ({ sendMessage }) => {
//   const [newMessage, setNewMessage] = useState("");
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [showEmojiOptions, setShowEmojiOptions] = useState(false);
//   const fileInputRef = useRef(null);
//   const [attachments, setAttachments] = useState([]);

//   const handleRemoveAttachment = (index) => {
//     setAttachments((prev) => prev.filter((_, i) => i !== index));
//   };

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (showEmojiOptions && !event.target.closest(".emoji-picker")) {
//         setShowEmojiOptions(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [showEmojiOptions]);

//   const handleSendMessage = () => {
//     if (!newMessage.trim() && attachments.length === 0) {
//       console.warn("Cannot send empty message.");
//       return;
//     }

//     sendMessage(newMessage, attachments);
//     setNewMessage("");
//     setAttachments([]);
//   };

//   const handleFileChange = (event) => {
//     const files = Array.from(event.target.files);
//     files.forEach((file) => {
//       if (file.type.startsWith('image/') || file.type === 'application/pdf' || file.type === 'application/msword' || file.type.startsWith('application/vnd.openxmlformats-officedocument')) {
//         setAttachments((prev) => [...prev, file]);
//       } else {
//         console.error('Selected file is not a supported type.');
//         toast.error("Only images and document files (PDF, Word) are allowed.");
//       }
//     });
//   };

//   const handleEmojiClick = (emoji) => {
//     setNewMessage((prev) => prev + emoji);
//   };

//   const toggleEmojiPicker = () => {
//     setShowEmojiOptions(!showEmojiOptions);
//   };

//   const removeSelectedImage = () => {
//     setSelectedImage(null);
//   };

//   return (
//     <div className={` ${window.innerWidth < 768 ? "flex flex-col bg-gray-800 p-2 rounded-lg" : "flex flex-col bg-gray-800 p-2 rounded-lg"} `}>
//       {selectedImage && (
//         <div className="relative mb-2">
//           <img
//             src={selectedImage.previewUrl}
//             alt="Selected"
//             className="w-24 h-24 rounded mr-2 cursor-pointer"
//           />
//           <FaTimes
//             className="text-white absolute top-0 right-0 mt-2 mr-2 cursor-pointer"
//             onClick={removeSelectedImage}
//           />
//         </div>
//       )}
//       <div className="flex items-center relative">
//         <FaSmile
//           className="text-white mr-4 cursor-pointer"
//           onClick={toggleEmojiPicker}
//         />
//         {showEmojiOptions && (
//           <div className="absolute bottom-full left-0 bg-gray-700 p-2 rounded z-10 emoji-picker">
//             <div className="flex flex-wrap">
//               {["😊", "😂", "👍", "❤️", "🎉", "😍", "😎", "🙌", "🥳", "🔥"].map(
//                 (emoji) => (
//                   <span
//                     key={emoji}
//                     className="cursor-pointer text-white text-2xl mr-2 mb-2"
//                     onClick={() => handleEmojiClick(emoji)}
//                   >
//                     {emoji}
//                   </span>
//                 )
//               )}
//             </div>
//           </div>
//         )}
//         <textarea
//           placeholder="Type a message"
//           className="bg-gray-800 text-white flex-1 outline-none resize-none border border-gray-600 p-2 rounded"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && !e.shiftKey) {
//               e.preventDefault();
//               handleSendMessage();
//             } else if (e.key === "Enter" && e.shiftKey) {
//               setNewMessage(newMessage + "\n");
//             }
//           }}
//         />
//         <FaPaperclip
//           className={`${window.innerWidth < 768 ? "text-white mx-1  cursor-pointer" : "text-white mx-4 cursor-pointer"}`}
//           onClick={() => fileInputRef.current.click()}
//         />
//         <div className="attachments-preview">
//           {attachments.map((file, index) => (
//             <div key={index} className="attachment-item">
//               {file.type.startsWith('image/') ? (
//                 <img
//                   src={URL.createObjectURL(file)}
//                   alt="Uploaded preview"
//                   className="w-24 h-24 rounded"
//                 />
//               ) : (
//                 <div className="file-preview text-white">
//                   <FaPaperclip className="inline mr-2" />
//                   {file.name}
//                 </div>
//               )}
//               <FaTimes
//                 className="text-white cursor-pointer ml-2"
//                 onClick={() => handleRemoveAttachment(index)}
//               />
//             </div>
//           ))}
//         </div>

//         <input
//           type="file"
//           ref={fileInputRef}
//           style={{ display: "none" }}
//           accept="image/*,.pdf,.doc,.docx"
//           onChange={handleFileChange}
//           aria-label="Upload attachments"
//         />
//         <button onClick={handleSendMessage} className="text-white ml-4">
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MessageInput;



import React, { useState, useRef, useEffect } from "react";
import { FaPaperclip, FaSmile, FaTimes, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiSend, FiPaperclip } from "react-icons/fi";

const MessageInput = ({ sendMessage, isSending = false, onTyping }) => {
  const [message, setMessage] = useState("");
  const [showEmojiOptions, setShowEmojiOptions] = useState(false);
  const fileInputRef = useRef(null);
  const [attachments, setAttachments] = useState([]);
  const textareaRef = useRef(null);
  const lastTypingTime = useRef(0);
  const typingTimeout = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

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

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    
    if (!message.trim() && attachments.length === 0) {
      return;
    }

    if (isSending) return; // Prevent double-send

    // Stop typing indicator when message is sent
    if (isTyping) {
      setIsTyping(false);
      // Inform parent component that user stopped typing
      if (onTyping && typeof onTyping === 'function') {
        onTyping(false);
      }
    }

    sendMessage(message, attachments);
    setMessage("");
    setAttachments([]);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = [];
    const invalidFiles = [];
    
    files.forEach((file) => {
      if (file.type.startsWith('image/') || 
          file.type === 'application/pdf' || 
          file.type === 'application/msword' || 
          file.type.startsWith('application/vnd.openxmlformats-officedocument')) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });
    
    if (invalidFiles.length > 0) {
      toast.error(`Unsupported file type${invalidFiles.length > 1 ? 's' : ''}: ${invalidFiles.join(', ')}`);
    }
    
    if (validFiles.length > 0) {
      setAttachments((prev) => [...prev, ...validFiles]);
    }
    
    // Reset the input
    event.target.value = '';
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiOptions(false);
    textareaRef.current.focus();
    
    // Trigger typing event when emoji is added
    handleUserTyping();
  };

  const toggleEmojiPicker = () => {
    setShowEmojiOptions(!showEmojiOptions);
  };

  const handleUserTyping = () => {
    const now = Date.now();
    
    // Set typing state to true if not already typing
    if (!isTyping) {
      setIsTyping(true);
      // Inform parent component that user is typing
      if (onTyping && typeof onTyping === 'function') {
        onTyping(true);
      }
    }
    
    // Only update the last typing time if it's been more than 1 second
    if (now - lastTypingTime.current > 1000) {
      lastTypingTime.current = now;
    }
    
    // Clear any existing timeout
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
    
    // Set a new timeout to end typing status after 3 seconds of inactivity
    typingTimeout.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        // Inform parent component that user stopped typing
        if (onTyping && typeof onTyping === 'function') {
          onTyping(false);
        }
      }
      lastTypingTime.current = 0;
    }, 3000);
  };

  const handleKeyDown = (e) => {
    // Send message on Enter (but not with Shift+Enter for newlines)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    } else {
      // User is typing something
      handleUserTyping();
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    // Trigger typing indicator logic
    handleUserTyping();
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSendMessage} className="flex flex-col bg-gray-800 p-2 rounded-lg border border-gray-700 shadow-md">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 p-2">
          {attachments.map((file, index) => (
            <div key={index} className="relative group">
              {file.type.startsWith('image/') ? (
                <div className="relative w-20 h-20 bg-gray-700 rounded">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveAttachment(index)}
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center bg-gray-700 p-2 rounded">
                  <FaPaperclip className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-300 truncate max-w-xs">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    className="ml-2 text-gray-400 hover:text-red-400"
                    onClick={() => handleRemoveAttachment(index)}
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center relative">
        {/* Emoji Picker */}
        <button 
          type="button"
          className="text-gray-400 hover:text-gray-300 p-2 rounded-full transition-colors" 
          onClick={toggleEmojiPicker}
          disabled={isSending}
        >
          <FaSmile size={20} />
        </button>
        
        {showEmojiOptions && (
          <div className="absolute bottom-full left-0 bg-gray-700 p-3 rounded-lg shadow-lg z-10 emoji-picker border border-gray-600">
            <div className="grid grid-cols-5 gap-2">
              {["😊", "😂", "👍", "❤️", "🎉", "😍", "😎", "🙌", "🥳", "🔥", 
                "👏", "🤔", "👀", "🙏", "💯", "👌", "😢", "😁", "💪", "🤣"].map(
                (emoji) => (
                  <button
                    type="button"
                    key={emoji}
                    className="cursor-pointer text-2xl hover:bg-gray-600 p-2 rounded transition-colors"
                    onClick={() => handleEmojiClick(emoji)}
                  >
                    {emoji}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Text Input */}
        <div className="flex-1 mx-2 relative">
          <textarea
            ref={textareaRef}
            placeholder="Type a message"
            className="bg-gray-700 text-white w-full outline-none resize-none p-3 rounded-lg border border-gray-600 transition-all"
            value={message}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isSending}
          />
        </div>

        {/* File Upload Button */}
        <button
          type="button"
          className="text-gray-400 hover:text-gray-300 p-2 rounded-full transition-colors mr-1"
          onClick={() => fileInputRef.current.click()}
          disabled={isSending}
        >
          <FaPaperclip size={20} />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileChange}
          multiple
          aria-label="Upload attachments"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={isSending || (!message.trim() && attachments.length === 0)}
          className={`p-3 rounded-full ${
            isSending || (!message.trim() && attachments.length === 0)
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          } transition-colors`}
        >
          {isSending ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            <FaPaperPlane size={16} />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;