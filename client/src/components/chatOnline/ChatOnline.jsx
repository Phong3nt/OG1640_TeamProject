import "./chatOnline.css"

export default function ChatOnline(){
  return(
    <div className="chatOnline">
        <div className="chatOnlineFriend">
          <div className="chatOnlineImgContainer">
            <img
            className="chatOnlineImg"
             src="https://images.pexels.com/photos/31509434/pexels-photo-31509434.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="" />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">Denis Statham</span>
        </div>
        <div className="chatOnlineFriend">
          <div className="chatOnlineImgContainer">
            <img
            className="chatOnlineImg"
             src="https://images.pexels.com/photos/31509434/pexels-photo-31509434.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="" />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">Denis Statham</span>
        </div>
        <div className="chatOnlineFriend">
          <div className="chatOnlineImgContainer">
            <img
            className="chatOnlineImg"
             src="https://images.pexels.com/photos/31509434/pexels-photo-31509434.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="" />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">Denis Statham</span>
        </div>
    </div>
  )
}