import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import dayjs from 'dayjs';
import swal from 'sweetalert';

export default function Card({ card, editAction, deleteAction }) {
    const { token } = useParams();
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        async function getActivities() {
            const { data } = await axios.get(`http://192.168.100.4:3000/api/trello/cards/${card.id}/actions`, {
                headers: {
                    Authorization: token
                }
            });

            const activities = data.body.map((activity) => {
                return <li class="list-group-item">{activity.data.text}</li>
            });

            setActivities(activities);
        }
        getActivities();
    }, []);

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{card.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{card.due && dayjs(card.due).format('YYYY-MM-DD')}</h6>
                <p className="card-text">{card.desc}</p>
            </div>
            <ul className="list-group list-group-flush">
                {activities.length > 0 &&
                    activities
                }
            </ul>
            <div class="card-body">
                <button className="btn btn-primary mx-2" onClick={editAction({ ...card, editMode: true })}>Edit</button>
                <button className="btn btn-danger" onClick={deleteAction(card)}>Delete</button>
            </div>
        </div>
    )
}