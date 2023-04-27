import { useEffect, useState } from "react";

function App() {
  const [properties, setProperties] = useState([]);
  const [property_type, setProperty_type] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  useEffect(() => {
    fetch("http://127.0.0.1:3000/properties")
      .then((res) => res.json())
      .then((data) => {
        if (!filterQuery) {
          setProperties(data);
        } else {
          setProperties(
            data.filter((product) =>
              product.name.toLowerCase().includes(filterQuery.toLowerCase())
            )
          );
        }
      });
  }, [filterQuery]);
  const uploadProductPicture = (files) => {
    const formData = new FormData();

    formData.append("file", files[0]);
    formData.append("upload_preset", "e2e6z2lx");
    fetch("https://api.cloudinary.com/v1_1/dakiak4mc/image/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setImage(data.secure_url);
      });
  };
  const fetchProperties = async () => {
    await fetch("http://127.0.0.1:3000/properties", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setProperties(data);
      });
  };
  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSubmit = () => {
    fetch("http://127.0.0.1:3000/properties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        property_type,
        image,
        price,
        address,
        description,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });
    setImage("");
    setDescription("");
    setPrice("");
    setAddress("");
    setProperty_type("");
  };
  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:3000/properties/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setProperties(properties.filter((property) => property.id !== id));
      });
  };

  const editProperty = (id) => {
    const property = properties.find((p) => p.id === id); // find the property by id
    setProperty_type(property.property_type); // set the property type
    setImage(property.image); // set the image
    setPrice(property.price); // set the price
    setAddress(property.address); // set the address
    setDescription(property.description); // set the description
    const updatedProperty = {
      // create an updated property object with the new field values
      property_type,
      image,
      price,
      address,
      description,
    };
    fetch(`http://127.0.0.1:3000/properties/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProperty),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        fetchProperties(); // fetch the updated properties list
      });
  };
  return (
    <>
      <div className="App">
        <input type="text" onChange={(e) => setFilterQuery(e.target.value)} />
        <h1>Properties</h1>
        {properties.map((property) => (
          <>
            <h1>{property.name}</h1>
            <button onClick={() => handleDelete(property.id)}>Delete</button>
            <button onClick={() => editProperty(property.id)}>Edit</button>
          </>
        ))}
      </div>

      <div>
        <input
          id="file-upload"
          name="file-upload"
          accept="image/*"
          type="file"
          onChange={(e) => uploadProductPicture(e.target.files)}
        />
        <input
          type="text"
          placeholder="property type"
          value={property_type}
          onChange={(e) => setProperty_type(e.target.value)}
        />
        <input
          type="text"
          placeholder="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </>
  );
}

export default App;
