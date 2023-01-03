import * as React from "react"
import { CartesianCoordinates, FunctionGraph, Line, Mafs, Point, Theme, useMovablePoint, useStopwatch, Vector2, vec } from "mafs"
import { easeInOutCubic } from "js-easing-functions"

function xyFromBernsteinPolynomial(
    p1: Vector2,
    c1: Vector2,
    c2: Vector2,
    p2: Vector2,
    t: number
) {
    return [
        vec.scale(p1, -(t ** 3) + 3 * t ** 2 - 3 * t + 1),
        vec.scale(c1, 3 * t ** 3 - 6 * t ** 2 + 3 * t),
        vec.scale(c2, -3 * t ** 3 + 3 * t ** 2),
        vec.scale(p2, t ** 3),
    ].reduce(vec.add, [0, 0])
};

function inPairs<T>(arr: T[]) {
    const pairs: [T, T][] = []
    for (let i = 0; i < arr.length - 1; i++) {
        pairs.push([arr[i], arr[i + 1]])
    }

    return pairs
};

function BezierCurves() {
    const [t, setT] = React.useState(0.5)
    const opacity = 1 - (2 * t - 1) ** 6

    const p1 = useMovablePoint([-5, 2])
    const p2 = useMovablePoint([5, -2])

    const c1 = useMovablePoint([-2, -3])
    const c2 = useMovablePoint([2, 3])

    const lerp1 = vec.lerp(p1.point, c1.point, t)
    const lerp2 = vec.lerp(c1.point, c2.point, t)
    const lerp3 = vec.lerp(c2.point, p2.point, t)

    const lerp12 = vec.lerp(lerp1, lerp2, t)
    const lerp23 = vec.lerp(lerp2, lerp3, t)

    const lerpBezier = vec.lerp(lerp12, lerp23, t)

    const duration = 2
    const { time, start } = useStopwatch({
        endTime: duration,
    })
    React.useEffect(() => {
        setTimeout(() => start(), 500)
    }, [start])
    React.useEffect(() => {
        setT(easeInOutCubic(time, 0, 0.75, duration))
    }, [time])

    function drawLineSegments(
        pointPath: Vector2[],
        color: string,
        customOpacity = opacity * 0.5
    ) {
        return inPairs(pointPath).map(([p1, p2], index) => (
            <Line.Segment
                key={index}
                point1={p1}
                point2={p2}
                opacity={customOpacity}
                color={color}
            />
        ))
    }

    function drawPoints(points: Vector2[], color: string) {
        return points.map((point, index) => (
            <Point
                key={index}
                x={point[0]}
                y={point[1]}
                color={color}
                opacity={opacity}
            />
        ))
    }

    return (
        <>
            <Mafs viewBox={{ x: [-5, 5], y: [-4, 4] }}>
                <CartesianCoordinates
                    xAxis={{ labels: false, axis: false }}
                    yAxis={{ labels: false, axis: false }}
                />

                {drawLineSegments(
                    [p1.point, c1.point, c2.point, p2.point],
                    Theme.pink,
                    0.5
                )}

                {drawLineSegments([lerp1, lerp2, lerp3], Theme.red)}
                {drawPoints([lerp1, lerp2, lerp3], Theme.red)}

                {drawLineSegments([lerp12, lerp23], Theme.yellow)}
                {drawPoints([lerp12, lerp23], Theme.yellow)}

                <FunctionGraph.Parametric
                    t={[0, t]}
                    weight={3}
                    xy={(t) =>
                        xyFromBernsteinPolynomial(
                            p1.point,
                            c1.point,
                            c2.point,
                            p2.point,
                            t
                        )
                    }
                />
                <FunctionGraph.Parametric
                    t={[1, t]}
                    weight={3}
                    opacity={0.5}
                    style="dashed"
                    xy={(t) =>
                        xyFromBernsteinPolynomial(
                            p1.point,
                            c1.point,
                            c2.point,
                            p2.point,
                            t
                        )
                    }
                />

                {drawPoints([lerpBezier], Theme.foreground)}

                {p1.element}
                {p2.element}
                {c1.element}
                {c2.element}
            </Mafs>
            </>
    )
};

export default BezierCurves;