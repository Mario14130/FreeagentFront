import { useState } from "react";


export default function Dropdown({ items, action }) {

    const [current, setCurrent] = useState({ displayName: 'Select' });

    console.log(items);

    function change(item, i, j) {
        return () => {
            action(item, i, j);
            setCurrent(item);
        }
    }

    const dropdownItems = items.flatMap((item, i, array) => {
        let newItem = item.map((subitem, j) => {
            return (
                <li key={subitem.id}>
                    <button className="dropdown-item" onClick={change(subitem, i, j)}>{subitem.displayName}</button>
                </li>
            );
        })

        if (i < array.length - 1) {
            newItem.push(<li><hr class="dropdown-divider" /></li>);
        }

        return newItem;

    })

    console.log(current.displayName);

    return (
        <>
            <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                    {current.displayName}
                </button>
                <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">
                    {items.length > 0 &&
                        dropdownItems
                    }
                </ul>
            </div>
        </>
    );

}