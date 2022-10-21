import Folder1 from '../../assets/folder1.svg';
import Folder2 from '../../assets/folder2.svg';

import './Table.scss';

// const data = [
//     {
//         data: 'Южная строительная площадка',
//         child: [
//             {
//                 data: 'Фундаментальные работы',
//                 child: [
//                     {
//                         data: 'Статья работы №1'
//                     },
//                     {
//                         data: 'Статья работы №2'
//                     },
//                 ]
//             }
//         ]
//     },
// ]

// const renderHierarchy = (data: { data: string }[]) => {
//     data.map(row => {
//         return (
//             <>
//                 <tr>
//                     <td>{Folder2}</td>
//                     <td>{row.data}</td>
//                     <td>0</td>
//                     <td>0</td>
//                     <td>0</td>
//                     <td>0</td>
//                 </tr>
//                 {renderHierarchy}
//             </>
//         )
//     })
// }

export const Table = () => {



    return (
        <table className="Table">
            <thead className="Table__Head">
                <tr className="Table__Row">
                    <th className="Table__Level">Уровень</th>
                    <th className="Table__Name">Наименование работ</th>
                    <th>Основная з/п</th>
                    <th>Оборудование</th>
                    <th>Накладные расходы</th>
                    <th>Сметная прибыль</th>
                </tr>
            </thead>
            <tbody className="Table__Body">
            </tbody>
        </table>
    )
};