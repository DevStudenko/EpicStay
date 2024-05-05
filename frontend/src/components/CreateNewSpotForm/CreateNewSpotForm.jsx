import { useState } from "react";
import { createSpot } from "../../store/spots";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { addImageToSpot } from "../../store/spots";
import styles from './CreateNewSpot.module.css';


const CreateNewSpotForm = () => {
    const [errors, setErrors] = useState({});
    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [images, setImages] = useState(Array(5).fill(''));
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const sessionUser = useSelector((state) => state.session.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleSubmit = (e) => {
        e.preventDefault();
        let newErrors = {};
        setErrors({});

        // Frontend validations
        if (!country) newErrors.country = 'Country is required';
        if (!address) newErrors.address = 'Street Address is required';
        if (!city) newErrors.city = 'City is required';
        if (!state) newErrors.state = 'State is required';
        if (!title) newErrors.title = 'Title is required';
        if (description.length < 30) newErrors.description = 'Description must be at least 30 characters';
        if (!price) newErrors.price = 'Price is required';
        if (!images[0]) newErrors.previewImage = 'Preview Image is required';


        setErrors(newErrors);

        // If there are any frontend errors, stop here
        if (Object.keys(newErrors).length > 0) return;

        // Proceed with backend submission if frontend validations pass
        dispatch(createSpot({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name: title,
            description,
            price
        })).then(data => {
            const imagePromises = images.filter(url => url !== '').map((url, index) => {
                return dispatch(addImageToSpot(data.id, { url, preview: index === 0 }));
            });

            Promise.all(imagePromises)
                .then(() => navigate(`/spots/${data.id}`))
                .catch(err => {
                    console.error("Failed to add images to spot:", err);
                });
        }).catch(async (res) => {
            if (res.ok === false) {
                const data = await res.json();
                console.log(data)
                if (data && data.errors) {
                    setErrors(prevErrors => ({ ...prevErrors, ...data.errors }));
                }
            }
        });
    };

    const handleImageChange = (index, value) => {
        const newImages = [...images];
        newImages[index] = value;
        setImages(newImages);
    };


    return (sessionUser ? (
        <main className={styles.main}>
            <h1 className={styles.title}>Create a new Spot</h1>
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

                <div className={styles.section}>
                    <h3 className={styles.subtitle}>Liven up your spot with photos</h3>
                    <h6 className={styles.title_description}>Submit a link to at least one photo to publish your spot.</h6>
                    {images.map((image, index) => (
                        <div key={index} className={styles.section}>
                            <label className={styles.input_group}>
                                <input
                                    className={styles.input}
                                    type="text"
                                    placeholder={index === 0 ? "Preview Image URL" : `Image URL ${index + 1}`}
                                    value={image}
                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                />
                                {index === 0 && errors.previewImage && <p className={styles.error}>{errors.previewImage}</p>}
                            </label>
                        </div>
                    ))}
                </div>

                <button type="submit" className={styles.button}>Create Spot</button>
            </form>

        </main>
    ) : <p className={styles.title_description}>Please Log In or Sign up</p>
    );
}

export default CreateNewSpotForm;
