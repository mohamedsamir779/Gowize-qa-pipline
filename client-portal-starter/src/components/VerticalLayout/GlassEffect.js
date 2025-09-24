export default function GlassEffect() {
  return (
    <div className="glass effect" style={
      {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "90%",
        background: "#fff",
        filter: "blur(20px)",
      }
    }>
      <div className="pink gradient"
        style={{
          position: "absolute",
          top: "0",
          right: "10%",
          width: "40%",
          height: "80%",
          background: "radial-gradient(ellipse at center,  rgba(93,106,232,0.3) 0%,rgba(93,106,232,0.3) 40%,rgba(93,106,232,0) 80%)",
          backdropFilter: "blur(4px)",
        }}
      ></div>
      <div className="pink gradient"
        style={{
          position: "absolute",
          top: "10%",
          left: "30%",
          width: "30%",
          height: "100%",
          background: "radial-gradient(ellipse at center,  rgba(211, 237, 238,0.3) 0%,rgba(211, 237, 238,0.3) 10%,rgba(211, 237, 238,1) 40%,rgba(211, 237, 238,0.1) 80%)",
          backdropFilter: "blur(40px)",
        }}
      ></div>
      <div className="pink gradient"
        style={{
          position: "absolute",
          top: "50%",
          left: "0",
          width: "100%",
          height: "50%",
          background: "radial-gradient(ellipse at center,  rgba(168, 218, 220,0.3) 0%,rgba(168, 218, 220,0.3) 1%,rgba(168, 218, 220,0.1) 70%,rgba(168, 218, 220,0) 0%)",
          backdropFilter: "blur(40px)",
        }}
      ></div>
    </div>
  );
}
