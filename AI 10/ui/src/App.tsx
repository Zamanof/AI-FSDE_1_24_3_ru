import './App.css'
import {predict, type PredictIn} from "./api"
import {cities} from "./cities"
import {useState} from "react";



function App() {
    const [formData, setFormData] = useState<PredictIn>({
        bedrooms: 0,
        bathrooms: 0,
        sqm:0,
        city:''
    });

    const [priceAZN, setPriceAZN] = useState<number|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setPriceAZN(null);
        try{
            const result = await predict(formData);
            setPriceAZN(result.priceAZN)
        }
        catch(err){
            setError(err instanceof Error ? err.message : "An error occurred.");
        }
        finally{
            setLoading(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prev=>({
            ...prev,
            [name]: name === 'city' ? value : Number(value)
        }))
    }

return (
    <div className="app">
        <div className="container">
            <h1>Price Prediction</h1>
            <form className='form' onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="bedrooms">Bedrooms</label>
                    <input
                        type="number"
                        id="bedrooms"
                        name="bedrooms"
                        value={formData.bedrooms}
                        min="0"
                        step="1"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">

                    <label htmlFor="bathrooms">Bathrooms</label>
                    <input
                        type="number"
                        id="bathrooms"
                        name="bathrooms"
                        value={formData.bathrooms}
                        min="0"
                        step="1"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="sqm">Square meters</label>
                    <input
                        type="number"
                        id="sqm"
                        name="sqm"
                        value={formData.sqm}
                        min="0"
                        step="0.01"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="city">City</label>
                    <select
                        name="city"
                        id="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select...</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={loading}
                >
                    {loading ? "Predicting..." : "Predict Price"}
                </button>
            </form>
            {error && <div className="error">{error}</div>}
            {
                priceAZN !== null &&(
                    <div className="result">
                        <h2>
                            Predicted Price: {Intl.NumberFormat("az-Az",{
                                style: "currency",
                                currency: "AZN",
                        }).format(priceAZN)}
                        </h2>
                    </div>
                )
            }
        </div>
    </div>
)
}

export default App;