import { useState, useEffect } from "react";
import { updateSpot, fetchSpotDetails } from "../../store/spots";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import styles from './UpdateSpot.module.css';



const UpdateSpotForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();


  const sessionUser = useSelector((state) => state.session.user);
  const spotDetails = useSelector((state) => state.spots[id]);


  const [errors, setErrors] = useState({});
  const [country, setCountry] = useState(spotDetails ? spotDetails.country : "");
  const [state, setState] = useState(spotDetails ? spotDetails.state : "");
  const [address, setAddress] = useState(spotDetails ? spotDetails.address : "");
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
      setAddress(spotDetails.address || "");
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
    if (!address) newErrors.address = 'Street Address is required';
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
      address,
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
    <main className={styles.main}>
      <h1 className={styles.title}>Update your Spot</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h3 className={styles.subtitle}>Where&apos;s your place located?</h3>
          <h6 className={styles.title_description}>Guests will only get your exact address once they have booked a reservation.</h6>
          <label className={styles.input_group}>
            <div className={styles.side_by_side}>
              Country
              {errors.country && <p className={styles.error}>{errors.country}</p>}
            </div>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
              className={styles.input}
            />
          </label>
          <label className={styles.input_group}>
            <div className={styles.side_by_side}>
              Street Address
              {errors.address && <p className={styles.error}>{errors.address}</p>}
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              className={styles.input}
            />
          </label>
          <div className={styles.side_by_side}>
            <label className={styles.input_group}>
              <div className={styles.side_by_side}>
                City
                {errors.city && <p className={styles.error}>{errors.city}</p>}
              </div>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className={styles.input}
              />
            </label>
            <label className={styles.input_group}>
              <div className={styles.side_by_side}>
                State
                {errors.state && <p className={styles.error}>{errors.state}</p>}
              </div>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
                className={styles.input}
              />
            </label>
          </div>
          <div className={styles.side_by_side}>
            <label className={styles.input_group}>
              <div className={styles.side_by_side}>
                Latitude
                {errors.lat && <p className={styles.error}>{errors.lat}</p>}
              </div>
              <input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="Latitude"
                className={styles.input}
              />
            </label>
            <label className={styles.input_group}>
              <div className={styles.side_by_side}>
                Longitude
                {errors.lng && <p className={styles.error}>{errors.lng}</p>}
              </div>
              <input
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="Longitude"
                className={styles.input}
              />
            </label>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.subtitle}>Describe your place to guests</h3>
          <h6 className={styles.title_description}>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</h6>
          <label className={styles.input_group}>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              placeholder="Please write at least 30 characters"
            />
            {errors.description && <p className={styles.error}>{errors.description}</p>}
          </label>
        </div>

        <div className={styles.section}>
          <h3 className={styles.subtitle}>Create a title for your spot</h3>
          <h6 className={styles.title_description}>Catch guests&apos; attention with a spot title that highlights was makes your place special.</h6>
          <label className={styles.input_group}>
            Name of your spot
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Name of your spot"
              className={styles.input}
            />
            {errors.name && <p className={styles.error}>{errors.name}</p>}
          </label>
        </div>

        <div className={styles.section}>
          <h3 className={styles.subtitle}>Set a base price for your spot</h3>
          <h6 className={styles.title_description}>Competitive pricing can help your listing stand out and rank higher in search results.</h6>
          <label className={styles.input_group}>
            Price per night (USD)
            <div className={styles.price_input}>
              $ <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price per night (USD)"
                className={styles.input}
              />
            </div>
            {errors.price && <p className={styles.error}>{errors.price}</p>}
          </label>
        </div>


        <button type="submit" className={styles.button}>Update your Spot</button>
      </form>

    </main>
  ) : <p className={styles.title_description}>Please Log In or Sign up</p>
  );
}

export default UpdateSpotForm