import React from 'react'

export const Loading = ({hidden}) => {
    return (
        <div className="loading-main" hidden={hidden}>
            <h1 className="loading-modal">Loading...</h1>
        </div>
    )
}
