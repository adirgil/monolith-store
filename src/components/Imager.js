import React from "react";
import "./Imager.scss";

export default function Imager({ img, onClick, className }) {
  const { url, title } = img;
  const fullUrl = `https://fedtest.monolith.co.il/api/imager.php?url=${url}&type=fit&width=1000&height=1000&quality=70`;
  const classes = `single-image ${className}`;
  return (
    <img className={classes} src={fullUrl} alt={title} onClick={onClick} />
  );
}
