export default function LandingSection(props)
{
    return (
        <div id={props.id} className="w-full mx-auto">
            {props.children}
        </div>
    )
}