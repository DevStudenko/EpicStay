import { useState } from "react";
import { createSpot } from "../../store/spots";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { addImageToSpot } from "../../store/spots";
import './CreateNewSpot.css';


function CreateNewSpot() {
    const [errors, setErrors] = useState({});
    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
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

        // Frontend validations
        if (!country) newErrors.country = 'Country is required';
        if (!streetAddress) newErrors.streetAddress = 'Street Address is required';
        if (!city) newErrors.city = 'City is required';
        if (!state) newErrors.state = 'State is required';
        if (!title) newErrors.title = 'Title is required';
        if (description.length < 30) newErrors.description = 'Description must be at least 30 characters';
        if (!price) newErrors.price = 'Price is required';
        if (!images[0]) newErrors.previewImage = 'Preview Image is required';

        // Update the state with any new errors
        setErrors(newErrors);

        // If there are any frontend errors, stop here
        if (Object.keys(errors).length > 0) return;

        // Proceed with backend submission if frontend validations pass
        dispatch(createSpot({
            address: streetAddress,
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
            console.log('this is inside catch')
            if (res.ok === false) {
                const data = await res.json();
                if (data && data.errors) {
                    // Combine backend errors with the current state (if any)
                    // console.log(data.errors);
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
        <>
            <div className="new-spot-form-container">
                <form className="new-spot-form" onSubmit={handleSubmit}>
                    <h1>Create a New Spot</h1>
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

                    <div className="form-group">
                        <h2>Liven up your spot with photos</h2>
                        {images.map((image, index) => (
                            <div key={index} className="image-upload-section">
                                <input
                                    className="image-url-input-container"
                                    type="text"
                                    placeholder={index === 0 ? "Preview Image URL" : `Image URL ${index + 1}`}
                                    value={image}
                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                />
                                {index === 0 && errors.previewImage && <p>{errors.previewImage}</p>}
                            </div>
                        ))}

                    </div>

                    <button className="create-spot-button">Create Spot</button>
                </form>
            </div>
        </>
    ) : <p>Please Log In or Sign up</p>
    );
}

export default CreateNewSpot;
