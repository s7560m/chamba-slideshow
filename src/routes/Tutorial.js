import './tutorial.css'
export default function Tutorial() {
    return (<div className="tutorial">
        <h1>Here's a quick video on how to get started.</h1>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/UgxWotwrH3I" title="YouTube video player"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen/>
    </div>)
}