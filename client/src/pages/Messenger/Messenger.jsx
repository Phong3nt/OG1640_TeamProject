import Conversation from "../../components/chat/Conversation"
import ChatOnline from "../../components/chatOnline/ChatOnline"
import Message from "../../components/message/Message"
import "./messenger.css"

export default function Messenger(){
  return (
    <>
    <div className="messenger">
      <div className="chatMenu">
        <div className="chatMenuWrapper">
        <h2 className="chatMenuTitle">Messages</h2>
          <input placeholder="Search for friends" className="chatMenuInput" />
          <Conversation />
          <Conversation />
          <Conversation />
          <Conversation />
        </div>
      </div>
      <div className="chatBox">
        <div className="chatBoxWrapper">
          <div className="chatBoxTop">
            <Message />
            <Message own={true} />
            <Message />
            <Message />
            <Message own={true} />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message own={true} />
            <Message />
            <Message own={true} />
            <Message own={true} />
            <Message />
            <Message own={true} />
          </div>
          <div className="chatBoxBottom">
            <textarea className="chatMessageInput" placeholder="Type here..." rows="2"/>
            <button className="chatSubmitButton">Send</button>
          </div>
        </div>
      </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline/>
          </div>
        </div>
    </div>
    </>
  )
}
