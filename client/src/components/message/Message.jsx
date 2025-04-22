import "./message.css"

export default function Message({own}) {
  return (
    <div className={own  ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src="https://images.pexels.com/photos/31509434/pexels-photo-31509434.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
          alt=""
        />
        <p className="messageText">Hello, how are you today</p>
      </div>
      <div className="messageBottom">just now</div>
    </div>
  )
}