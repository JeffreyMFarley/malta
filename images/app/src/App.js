import './App.less'
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react'
import TagPanel from './components/TagPanel'

/**
* renders the App component
*
* @returns {string} the HTML to render
*/
function App() {
  return (
    <div id="App">
      <header>Header</header>
      <main>
        <nav>Nav</nav>
        <section>
          <article>Article 1</article>
          <article>Article 2</article>
          <article>Article 3</article>
        </section>
        <aside><TagPanel /></aside>
      </main>
      <footer>footer</footer>
    </div>
  )
}

export default App;
