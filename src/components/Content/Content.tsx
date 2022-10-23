import { Table } from '../Table/Table';
import './Content.scss';

export const Content = () => {
    return (
        <div className="Content">
            <div className="Content__Info">
                <div className="Content__InfoText">
                    Строительно-монтажные работы
                </div>
            </div>
            <div className="Content__TableWrapper">
                <Table />
            </div>
        </div>
    )
}