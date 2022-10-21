
import { Content } from '../Content/Content';
import { LeftPanel } from '../LeftPanel/LeftPanel';
import { Navbar } from '../Navbar/Navbar';
import './App.scss';

export const App = () => {
    return (
        <div className="App">
            <Navbar />
            <div className="App__Main">
                <LeftPanel />
                <Content />
            </div>
        </div>
    )
}