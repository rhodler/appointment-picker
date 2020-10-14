import React, { useState } from 'react';
import { format, set } from 'date-fns';
import { fr } from 'date-fns/locale';

export const Input = ({data, handleDateOff}) => {
    const startDate = new Date();
    const [display, setDisplay] = useState(false);
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    
    const handleChange = value => {
        setSearch(value);

        if (value.length > 1 && value.trim().length) {        
            const regex = new RegExp(`^${value}`, 'i');
            setDisplay(true);

            const suggestion = data.filter((item) => {
                return regex.test(item.day);
            });
            
            setSuggestions(suggestion);
        } else setDisplay(false);
    }

    const handleSelect = value => {
        handleDateOff(value);
        setDisplay(false);
        setSearch('');
    }
    
    return (
        <div className="form-group">
            <input
            value={search}
            onChange={e => handleChange(e.target.value)} 
            type="text" 
            placeholder={`Exemple: ${format(startDate, "dd LLLL Y", {locale: fr})}`}/>
            
            {display && 
            <div className="display">
                <ul>
                    {suggestions.map((item, index) => {
                        return (
                            <li onClick={() => handleSelect(item.day)} key={index}>{item.day}</li>
                        )
                    })}
                </ul>
            </div>}
        </div>
    )
}
