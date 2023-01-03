import BezierCurves from './Bezier';
import RiemannSum from './Riemann';
import {Mafs} from 'mafs';

function App() {
    return (
        <div className="App">
            <h1>Bezier Curves</h1>
            <Mafs>
                <BezierCurves />
            </Mafs>
            <h1>Riemann Sum</h1>
            <Mafs>
                <RiemannSum />  
            </Mafs> 
        </div>
    );
};

export default App;
