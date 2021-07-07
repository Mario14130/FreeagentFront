import { useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import dayjs from 'dayjs';

export default function EditCard({ card, actionAfterEdit }) {
    const { token } = useParams();
    const [editedCard, setEditedCard] = useState({ ...card });

    function handleChange(key) {
        return (event) => {
            const value = event.target.value;
            setEditedCard({ ...editedCard, [key]: value });
        }
    }

    async function saveCard(event) {
        let method = 'put';
        if (card.new) {
            method = 'post';
        } 
        try {
            const url = card.id ? `http://localhost:3000/api/trello/cards/${card.id}` : `http://localhost:3000/api/trello/cards`
            const { data } = await axios[method](url, null, {
                headers: {
                    Authorization: token
                },
                params: {
                    ...editedCard,
                }
            });
            if (editedCard.new) {
                actionAfterEdit(data.body, 'create');
            } else {
                actionAfterEdit(data.body, 'edit');
            }
        } catch(error) {
            throw new Error('Error Edit Component');
        }
    }

    function cancel(event) {
        actionAfterEdit({...card, editMode: false}, 'cancel');
    }

    function setDate() {
        const date = dayjs(editedCard.due).format('YYYY-MM-DD');
        return date;
    }

    return (
        <div className="card">
            <div className="card-body">
                <div class="input-group">
                    <span class="input-group-text">Name</span>
                    <input onChange={handleChange('name')} type="text" aria-label="name" class="form-control" value={editedCard.name} />
                </div>
                <div class="input-group">
                    <span class="input-group-text">Due Date</span>
                    <input onChange={handleChange('due')} type="date" aria-label="due" class="form-control" value={editedCard.due && setDate()} />
                </div>
                <div class="input-group">
                    <span class="input-group-text">Description</span>
                    <input onChange={handleChange('desc')} type="text" aria-label="description" class="form-control" value={editedCard.desc} />
                </div>
            </div>
            <div class="card-body">
                <button className="btn btn-primary mx-2" onClick={cancel}>Cancel</button>
                <button className="btn btn-success" onClick={saveCard}>Save</button>
            </div>
        </div>
    );

}