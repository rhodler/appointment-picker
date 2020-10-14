import React from 'react'

export const CheckBox = ({value, isChecked, handleClickCheckbox}) => {
    return (
        <div className="checkbox">
            <input onClick={handleClickCheckbox} onChange={() => null} type="checkbox" value={value} checked={isChecked}/>
            {' '}
            {value}
        </div>
    )
}
