export default function  CustomTick({ x, y, payload, loading }: { x: number; y: number; loading: boolean, payload: { value: string } }) {
    return (
        <text
            x={x}
            y={y}
            dy={-4}
            fill={loading ? 'transparent' : 'black'}
            fontSize={10}
            textAnchor="middle"
        >
            {payload.value.split(' ').map((word: string, index: number) => (
                <tspan key={index} x={x} dy={index ? '1.2em' : 0}>
                    {word}
                </tspan>
            ))}
        </text>
    );
}