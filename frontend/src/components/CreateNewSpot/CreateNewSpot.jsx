import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSpot } from '../../store/spots';
import './CreateNewSpot.css'

const CreateNewSpot = () => {
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrls, setImageUrls] = useState(['']);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            country,
            address,
            city,
            state,
            latitude,
            longitude,
            description,
            title,
            price,
            imageUrls
        };
        dispatch(createSpot(formData));
        navigate('/spots'); // Assuming this is the route where you show all spots
    };

    const addImageField = () => {
        setImageUrls([...imageUrls, '']);
    };

    const updateImageField = (index, url) => {
        const updatedImageUrls = [...imageUrls];
        updatedImageUrls[index] = url;
        setImageUrls(updatedImageUrls);
    };

    const renderImageFields = () => {
        return imageUrls.map((url, index) => (
            <input
                key={index}
                type="text"
                placeholder={`Image URL ${index + 1}`}
                value={url}
                onChange={(e) => updateImageField(index, e.target.value)}
                required={index === 0} // make the first image URL required
            />
        ));
    };

    return (
        <div className="new-spot-form-container">
            <h2>Create a New Spot</h2>
            <form onSubmit={handleSubmit} className="new-spot-form">
                <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <p className="input-description">Guests will only get your exact address once they booked a reservation.</p>
                    <input
                        id="country"
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="address">Street Address</label>
                    <input
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                        id="state"
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="latitude">Latitude</label>
                    <p className="input-description">Optional - Latitude and Longitude inputs are optional for MVP</p>
                    <input
                        id="latitude"
                        type="number"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="longitude">Longitude</label>
                    <input
                        id="longitude"
                        type="number"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Describe your place to guests</label>
                    <p className="input-description">Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="title">Create a title for your spot</label>
                    <p className="input-description">Catch guests attention with a spot title that highlights what makes your place special.</p>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="price">Set a base price for your spot</label>
                    <p className="input-description">Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <div className="price">
                        <span className='dollar-sign'>$</span>
                        <input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>

                </div>

                <div className="form-group">
                    <p>Liven up your spot with photos</p>
                    <p className="input-description">Submit a link to at least one photo to publish your spot.</p>
                    <div className="image-upload-section">
                        {renderImageFields()}
                        <button type="button" onClick={addImageField} className="add-image-button">+ Add Another Image</button>
                    </div>
                </div>

                <button type="submit" className="create-spot-button">Create Spot</button>
            </form>
        </div>
    );
};

export default CreateNewSpot;
