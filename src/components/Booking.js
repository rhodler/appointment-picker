import React from 'react';

export const Booking = ({data, cancellation}) => {
    return (
        <>
            {data.filter(day => day.hours.length)
            .map((item, index) => {
                return (
                <div key={index} className="booking">
                    <div>
                    {item.day}
                    </div>
                    <div>
                    {item.hours
                    .map((hour, index) => {
                        return (
                        <div className="hour_selected" key={index}>
                            <span>{hour}</span>
                            {' '}
                            <span className="cancel" onClick={() => cancellation({id: item.id, hour})}>❌</span>
                        </div>
                        )
                    })}
                    </div>
                </div>  
                )
            })}
        </>
    )
}
