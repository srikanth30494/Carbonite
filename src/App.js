import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      filteredData: [],
      masterData: [],
      loading: false,
      sortStatusAsc: true,
      filterText: '',
    };
  }

  sortData = (a, b) => {
    const { sortStatusAsc } = this.state;
    const nameA = a.company.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.company.name.toUpperCase();
    const sort = sortStatusAsc ? 1 : -1;
    return (nameA > nameB ? 1 : -1) * sort;
  }

  sortToggle = () => {
    const { masterData } = this.state;
    this.setState({sortStatusAsc: !this.state.sortStatusAsc}, () => {
      const sortedData = masterData.sort(this.sortData);
      this.setState({ data: sortedData});
    })
  }

  getUsersData = () => {
    this.setState({ loading: true });
    try {
      fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then((data) => {
          const sortedData = data.sort(this.sortData);
          this.setState({ filteredData: sortedData, masterData: sortedData, loading: false });
      })
    } catch (error) {
      this.setState({ loading: false });
      console.log('err', error);
    }
  }

  filterByCompany = (evt) => {
    let filteredData = this.state.masterData;
    this.setState({ filterText: evt.target.value }, () => {
      let { filterText } = this.state;
      filteredData = filteredData.filter((o) => o.company.name.toLowerCase().startsWith(filterText.toLowerCase()));
      this.setState({ filteredData });
    });
  }
  render() {
    const { filteredData, loading, sortStatusAsc } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-brand">Carbonite</div>
          <button className="App-get-users" onClick={this.getUsersData}>Get Users</button>
        </header>
        <main>
          <section className="App-main-center">
          <button className="App-sort-toggle" onClick={this.sortToggle}>Sort Toggle : {sortStatusAsc ?  'A' : 'D'}</button>
            <table id="App-table">
              <thead>
                <tr>
                  <th>Company Name <br />
                    <input 
                      type="text"
                      onChange={this.filterByCompany}
                      placeholder="Enter company name ..."
                    />
                  </th>
                  <th>Name</th>
                  <th>Website</th>
                  <th>City</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((colData) => {
                  return (<tr key={colData.id}>
                    <td>{colData.company.name}</td>
                    <td>{colData.name}</td>
                    <td>{colData.website}</td>
                    <td>{colData.address.city}</td>
                  </tr>)
                })}
              </tbody>
            </table>
            {loading && <div className="loading-spinner"></div>}
          </section>
        </main>
        <footer className="App-footer">
          <a className="App-footer-brand-url" target="blank" href="https://www.carbonite.com/">Visit Carbonite!</a>
        </footer>
      </div>
    );
  }
}

export default App;
