import { useEffect, useState } from 'react';
import Dropdown from '../../components/dropdown/dropdown.component';
import List from '../../components/list/list.component';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import useQuery from '../../hooks/useQuery/useQuery.hook';

export default function Home() {
    let history = useHistory();
    let query = useQuery();
    let { username, token } = useParams();
    let organizations = JSON.parse(query.get('organizations'));
    const [boards, setBoards] = useState([]);
    const [workspaces, setWorkspaces] = useState([]);
    const [lists, setLists] = useState([]);

    if (!organizations) {
        history.push('/');
    }

    if (token || localStorage.getItem('token')) {
        localStorage.setItem('token', token);
    } else {
        history.push();
    }

    useEffect(() => {
        async function getWorkspaces() {
            const { data } = await axios.get(`http://192.168.100.4:3000/api/trello/batch`, {
                headers: {
                    Authorization: token
                },
                params: {
                    urls: organizations.map(idOrganization => `/organizations/${idOrganization}`).join(',')
                }
            });

            const workspaces = []

            workspaces.push(data.body.map((workspace) => {
                return {
                    ...workspace[200],
                }
            }));

            console.log(workspaces);
            setWorkspaces(workspaces);
        }
        getWorkspaces();
    }, []);

    async function workspaceAction(workspace, i, j) {
        console.log(`Make request of boards from: ${workspace.displayName}`, i, j);
        setBoards([]);
        setLists([]);
        const { data } = await axios.get(`http://localhost:3000/api/trello/organizations/${workspace.id}/boards`, {
            headers: {
                Authorization: token
            }
        });

        const boards = []

        boards.push(data.body.map((board) => {
            return {
                ...board,
                displayName: board.name
            }
        }));

        setBoards(boards);
    }

    async function boardAction(board, i, j) {
        console.log(`Make request of boards from: ${board.displayName}`, i, j);
        console.log(board);
        setLists([]);
        const { data } = await axios.get(`http://localhost:3000/api/trello/boards/${board.id}/lists`, {
            headers: {
                Authorization: token
            }
        });

        const lists = data.body.map((list) => {
            return <div className="mr-2"><List list={list} /></div>
        });

        setLists(lists);
    }

    return (
        <div className="w-75">
            {/* <nav className="navbar navbar-dark bg-dark align-items-center justify-content-center mb-3"> */}
                <h4 className="pr-3 pb-3">User: {username.toUpperCase()}</h4>
            {/* </nav> */}

            <div className="w-100 d-flex justify-content-around mb-5">
                {workspaces.length > 0 &&
                    <div>
                        <strong><span className="d-inline-block pb-3"> Workspaces </span></strong>
                        <Dropdown items={workspaces} action={workspaceAction} />
                    </div>
                }

                {boards.length > 0 &&
                    <div>
                        <strong><span className="d-inline-block pb-3"> Boards </span></strong>
                        <Dropdown items={boards} action={boardAction} />
                    </div>
                }
            </div>

            <div className="d-flex justify-content-around">
                {lists.length > 0 &&
                    lists
                }
            </div>

        </div>
    );
}