import { useState, useEffect } from "react";
import { updateSpot, fetchSpotDetails } from "../../store/spots";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import './UpdateSpot.css';



const UpdateSpotForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();


  const sessionUser = useSelector((state) => state.session.user);
  const spotDetails = useSelector((state) => state.spots[id]);


  const [errors, setErrors] = useState({});
  const [country, setCountry] = useState(spotDetails ? spotDetails.country : "");
  const [state, setState] = useState(spotDetails ? spotDetails.state : "");
  const [streetAddress, setStreetAddress] = useState(spotDetails ? spotDetails.address : "");
  const [city, setCity] = useState(spotDetails ? spotDetails.city : "");
  const [title, setTitle] = useState(spotDetails ? spotDetails.name : "");
  const [description, setDescription] = useState(spotDetails ? spotDetails.description : "");
  const [price, setPrice] = useState(spotDetails ? spotDetails.price : "");
  const [lat, setLat] = useState(spotDetails ? spotDetails.lat : "");
  const [lng, setLng] = useState(spotDetails ? spotDetails.lng : "");


  useEffect(() => {
    if (!spotDetails) {
      dispatch(fetchSpotDetails(id));
    } else {
      setCountry(spotDetails.country || "");
      setState(spotDetails.state || "");
      setStreetAddress(spotDetails.address || "");
      setCity(spotDetails.city || "");
      setTitle(spotDetails.name || "");
      setDescription(spotDetails.description || "");
      setPrice(spotDetails.price || "");
      setLat(spotDetails.lat || "");
      setLng(spotDetails.lng || "");
    }
  }, [dispatch, id, spotDetails]);


  const handleSubmit = (e) => {
    console.log("handleSubmit called");
    e.preventDefault();
    let newErrors = {};

    // Frontend validations
    if (!country) newErrors.country = 'Country is required';
    if (!streetAddress) newErrors.address = 'Street Address is required';
    if (!city) newErrors.city = 'City is required';
    if (!state) newErrors.state = 'State is required';
    if (!title) newErrors.name = 'Title is required';
    if (description.length < 30) newErrors.description = 'Description must be at least 30 characters';
    if (!price) newErrors.price = 'Price is required';
    console.log(newErrors);
    setErrors(newErrors);


    if (Object.keys(newErrors).length > 0) return;

    //Backend submission if frontend validations pass
    const spotData = {
      id,
      country,
      state,
      address: streetAddress,
      city,
      name: title,
      description,
      price: parseFloat(price),
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    }

    dispatch(updateSpot(id, spotData))
      .then(() => navigate(`/spots/${id}`))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  };




  return (sessionUser ? (
    <>
      <div className="new-spot-form-container">
        <form className="new-spot-form" onSubmit={handleSubmit}>
          <h1>Update your Spot</h1>
          <div className="form-group">
            <h2>Where is your place located?</h2>
            <p>
              Guests will only get your exact address once they booked a
              reservation.
            </p>
            <label>
              Country
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </label>
            {errors.country && <p>{errors.country}</p>}
          </div>


          <label>
            Street Address
            <input
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
            />
          </label>
          {errors.streetAddress && <p>{errors.streetAddress}</p>}


          <div className="form-group-together">
            <div className="form-group-left">
              <label>
                City
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </label>
              {errors.city && <p>{errors.city}</p>}
            </div>

            <div className="form-group-right">
              <label>
                State
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </label>
              {errors.state && <p>{errors.state}</p>}
            </div>

          </div>


          <div className="form-group-together">
            <label>
              Lat
              <input
                type="number"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
            </label>
            {errors.lat && <p>{errors.lat}</p>}

            <label>
              Lng
              <input
                type="number"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
              />
            </label>
            {errors.lng && <p>{errors.lng}</p>}
          </div>


          <div className="form-group">
            <h2>Describe your place to guests</h2>
            <p>
              Mention the best features of your space, any special amentities like
              fast wifi or parking, and what you love about the neighborhood.
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please write at least 30 characters"></textarea>
            {errors.description && <p>{errors.description}</p>}
          </div>

          <div className="form-group">
            <h2>Create a title for your spot</h2>
            <p>
              Catch guests&#39; attention with a spot title that highlights what makes
              your place special.
            </p>

            <input
              placeholder="Name of your spot"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <p>{errors.title}</p>}
          </div>

          <div className="form-group">
            <h2>Set a base price for your spot</h2>
            <p className="input-description">
              Competitive pricing can help your listing stand out and rank higher in
              search results.
            </p>

            <input
              type="number"
              placeholder="Price per night (USD)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {errors.price && <p>{errors.price}</p>}
          </div>
          <button type="submit" className="create-spot-button">Update your Spot</button>
        </form>
      </div>
    </>
  ) : <p>Please Log In or Sign up</p>
  );
}

export default UpdateSpotForm