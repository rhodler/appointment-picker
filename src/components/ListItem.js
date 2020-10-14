import React from 'react'

export const ListItem = ({data, remove}) => {
    return (
        <ul>
            {data.map((item, index) => {
                return (
                    <li key={index} className="item">
                        <span>{item}</span>
                        <span onClick={() => remove(item)} className="cancel">❌</span>
                    </li>
                )
            })}
        </ul>
    )
}
