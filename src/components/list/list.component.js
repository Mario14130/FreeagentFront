import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Card from '../card/card.component';
import EditCard from '../edit-card/edit-card.component';
import swal from 'sweetalert';

export default function List({ list }) {
    const { token, username } = useParams();
    const [cardElements, setCardElements] = useState([]);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        async function getCards() {
            const { data } = await axios.get(`http://192.168.100.4:3000/api/trello/lists/${list.id}/cards`, {
                headers: {
                    Authorization: token
                }
            });
            setCards(data.body.map((card) => { return { ...card, editMode: false } }));
        }
        getCards();

    }, []);

    useEffect(() => {
        const newCardElements = cards.map((card) => {
            if (card.editMode) {
                return <li class="list-group-item" key={card.id}><EditCard card={card} actionAfterEdit={actionAfterEditCard} /></li>
            } else if (card.id) {
                return <li class="list-group-item" key={card.id}><Card card={card} editAction={editCard} deleteAction={askForDeleteCard} /></li>
            }
        });

        setCardElements(newCardElements);
    }, [cards]);

    function editCard(editedCard) {
        return (event) => {
            const newCards = cards.map(card => {
                if (card.id === editedCard.id) {
                    return editedCard;
                }
                return card;
            });

            setCards(newCards);
        }
    }

    function actionAfterEditCard(editedCard, action) {
        // TODO: implement  function
        let newCards = [];
        if (action === 'edit') {
            newCards = cards.map(card => {
                if (card.id === editedCard.id) {
                    return editedCard;
                }
                return card;
            });

            swal(`Updated`, `Card "${editedCard.name}" has been successfully updated`, "success");
        } else if (action === 'create') {
            console.log('CARDS', cards);
            newCards = [...cards.filter(card => !card.new), editedCard];
            swal(`Created`, `Card "${editedCard.name}" has been successfully created`, "success");
        }

        setCards(newCards);
    }

    async function deleteCard(deletedCard) {
        try {
            const { data } = await axios.delete(`http://localhost:3000/api/trello/cards/${deletedCard.id}`, {
                headers: {
                    Authorization: token
                },
                data: {
                    username,
                    card: deletedCard
                }
            });

            setCards(cards.filter(card => card.id !== deletedCard.id));
            return data.body;
        } catch (error) {
            throw new Error({ message: 'It was not possible to delete this card, try again' });
        }
    }

    function askForDeleteCard(card) {
        return async () => {
            const willDelete = await swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this card!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            });

            if (willDelete) {
                try {
                    await deleteCard(card);
                    swal("Poof! Your card has been deleted!", {
                        icon: "success",
                    });
                } catch (err) {
                    swal(err.message, {
                        icon: 'error'
                    });
                }
            } else {
                swal("Your card is safe!");
            }
        }

    }

    function creatingCard(event) {
        const card = { editMode: true, new: true, idList: list.id };
        setCards([...cards, card]);
    }


    return (
        <div className="card">
            <div className="card-header">
                {list.name}
            </div>
            <ul className="list-group list-group-flush">
                {cardElements.length > 0 &&
                    cardElements
                }
            </ul>
            <div className="card-footer">
                <button className="btn btn-success mx-2" onClick={creatingCard}> Create card </button>
            </div>
        </div>
    )

}