import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleProduct, addVariantToCart } from "../api/monolithData";
import Dropdown from "../components/Dropdown";
import Imager from "../components/Imager";
import "./ProductPage.scss";
import { Button, TextField } from "@mui/material";
import { ColorRing } from "react-loader-spinner";
import BasicModal from "../components/Modal";

export default function SingleProduct() {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [variants, setVariants] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [filteredVariants, setFilteredVariants] = useState([]);
  const [filters, setFilter] = useState([]);
  const [selectedImage, setSelectedImage] = useState({ url: "", title: "" });
  const [selectedVariant, setSelectedVariant] = useState({});
  const [modalInfo, setModalInfo] = useState({ isOpen: false, msg: "" });

  const { id } = useParams();

  useEffect(() => {
    const newVariants = variants.filter((variant) => {
      const { labels } = variant;

      const mappedLabels = {};
      labels.forEach((label) => {
        mappedLabels[label.attribute_id] = label.label_id;
      });

      return filters.reduce((prev, filter) => {
        return prev && mappedLabels[filter.attribute_id] === filter.label_id;
      }, true);
    });

    setFilteredVariants(newVariants);
  }, [filters]);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const product = await getSingleProduct(id);
        setProduct(product);
        const { variants, attributes, images } = product;
        if (attributes) setAttributes(attributes);
        if (images) setSelectedImage(images[0]);
        if (variants) {
          setVariants(variants);
          setFilteredVariants(variants);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  useEffect(() => {
    if (filteredVariants.length === 1) {
      const { image } = filteredVariants[0];
      setSelectedImage(image);
      setSelectedVariant(filteredVariants[0]);
    } else {
      setSelectedVariant({});
    }
  }, [filteredVariants]);

  const onChangeAttribute = (attribute_id, label_id) => {
    const newFilters = filters.filter((f) => f.attribute_id !== attribute_id);
    newFilters.push({ attribute_id, label_id });

    setFilter(label_id !== "none" ? newFilters : []);
  };

  const mapLabelsForAttributes = () => {
    const mappedAttrLabels = {};
    filteredVariants.forEach((variant) => {
      const { labels } = variant;
      labels.forEach((label) => {
        const { attribute_id, label_id } = label;
        if (mappedAttrLabels.hasOwnProperty(`${attribute_id}`)) {
          if (!mappedAttrLabels[attribute_id].includes(label_id)) {
            mappedAttrLabels[attribute_id].push(label_id);
          }
        } else {
          mappedAttrLabels[attribute_id] = [];
          mappedAttrLabels[attribute_id].push(label_id);
        }
      });
    });
    return mappedAttrLabels;
  };

  const renderAttributes = () => {
    if (filteredVariants) {
      const mappedAttrLabels = mapLabelsForAttributes();
      const filteredAttrLabels = attributes.map((attr) => {
        const { labels } = attr;
        const fileredLabels = labels.filter((label) => {
          return (
            mappedAttrLabels[attr.id] &&
            mappedAttrLabels[attr.id].includes(label.id)
          );
        });

        return {
          ...attr,
          labels: fileredLabels,
        };
      });
      return filteredAttrLabels.map((attribute) => {
        const { title, labels, id } = attribute;

        return (
          <Dropdown
            onChangeAttribute={onChangeAttribute}
            key={id}
            id={id}
            title={title}
            labels={labels}
          />
        );
      });
    }
  };

  const addToCart = async () => {
    const quantity = document.getElementById("quantity").value;
    const { id } = selectedVariant;
    if (id && parseInt(quantity) > 0) {
      const response = await addVariantToCart(id, quantity);
      if (response) {
        setModalInfo({ isOpen: true, msg: response.msg });
      }
    } else {
      setModalInfo({ isOpen: true, msg: "you didnt fill all the fields" });
    }
  };

  const onCloseModal = () => {
    setModalInfo({ ...modalInfo, isOpen: false });
  };

  const { images, title, min_price, max_price, description } = product;
  return (
    <>
      <ColorRing height={100} width={100} visible={loading} />
      {!loading && (
        <div id="product">
          <div className="gallery">
            {selectedImage && (
              <Imager className="main-image" img={selectedImage} />
            )}
            <div className="gallery-options">
              {images &&
                images.map((img) => {
                  return (
                    <Imager
                      key={img.title}
                      img={img}
                      onClick={() => setSelectedImage(img)}
                    />
                  );
                })}
            </div>
          </div>
          <div className="info">
            <div className="title">{title}</div>
            <div className="price">
              {selectedVariant.price
                ? selectedVariant.price
                : `${min_price}$ - ${max_price}`}
            </div>
            <div className="description">{description}</div>
          </div>
          <div className="selection">
            {renderAttributes()}
            <TextField
              id="quantity"
              type="number"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]" }}
              label="quantity"
            />
            <Button
              className="cart-btn"
              variant="contained"
              onClick={addToCart}
            >
              add to cart
            </Button>
          </div>
          <BasicModal
            isOpen={modalInfo.isOpen}
            msg={modalInfo.msg}
            onClose={onCloseModal}
          />
        </div>
      )}
    </>
  );
}
