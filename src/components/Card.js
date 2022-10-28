import * as React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

import { useNavigate } from "react-router-dom";
import "./Card.scss";

export default function ImgMediaCard({ product }) {
  const navigate = useNavigate();

  const goToProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const { images, title, min_price, max_price, id } = product;
  const { url } = images[0];
  const fullUrl = `https://fedtest.monolith.co.il/api/imager.php?url=${url}&type=fit&width=1000&height=1000&quality=70`;
  return (
    <Card
      onClick={() => goToProduct(id)}
      sx={{ maxWidth: 345 }}
      className="single-card"
    >
      <CardMedia component="img" alt={title} height="140" image={fullUrl} />
      <CardContent>
        <Typography
          className="card-title"
          gutterBottom
          variant="h5"
          component="div"
        >
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`${min_price}$ - ${max_price}$`}
        </Typography>
      </CardContent>
    </Card>
  );
}
