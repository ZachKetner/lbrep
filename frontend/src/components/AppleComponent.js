import React, { useState } from "react";

function AppleComponent() {
    const [numberOfApples, setNumberOfApples] = useState(1 + 3);

    function AppleDisplay(numberOfApples) {
        if (numberOfApples === 0 || numberOfApples === 1) {
            return `John has ${numberOfApples} apple.`;
        } else if (numberOfApples > 1) {
            return `John has ${numberOfApples} apples.`;
        } else {
            return `John owes us ${Math.abs(numberOfApples)} apples.`;
        }
    }

    function IncreaseApple() {
        setNumberOfApples((currentValue) => currentValue + 1);
    }

    function DecreaseApple() {
        setNumberOfApples((currentValue) => currentValue - 1);
    }

    function TooManyDisplay() {
        if (numberOfApples > 10) {
            return <h1>John has too many Apples!</h1>;
        } else {
            return "";
        }
    }
    return (
        <div className="container m-5">
            <div>
                <h1>{AppleDisplay(numberOfApples)}</h1>
            </div>
            <button onClick={IncreaseApple} className="btn btn-primary m-2">
                Increase
            </button>
            <button
                style={{ display: numberOfApples <= 0 ? "none" : ''}}
                onClick={DecreaseApple}
                className="btn btn-danger m-2"
            >
                Decrease
            </button>
            {TooManyDisplay()}
        </div>
    );
}

export default AppleComponent;
