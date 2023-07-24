import { useMemo } from "react";
function Card({ path, title, createdAt }) {
  const timestamp = useMemo(() => {
    const date = `${new Date(createdAt.seconds * 1000)}`.split(" ");
    return `${date[1]} ${date[2]} ${date[3]}`;
  }, [createdAt.seconds]);
  return (
    <div className="col mb-5">
      <div className="card" style={{ width: "18rem" }}>
        <div
          style={{
            height: "260px",
            backgroundImage: `url(${path})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        />
        <h5 className="text-center pt-2">{title}</h5>
        <div className="d-flex justify-content-between px-2">
          <p>{timestamp}</p>
          <i>@username</i>
        </div>
      </div>
    </div>
  );
}
export default Card;
