import React from 'react';

export default function HeaderSearch() {
  return (
    <div className="search-popup">
      <button className="close-search style-1"><i className="fa fa-times"></i></button>
      <button className="close-search"><i className="fas fa-arrow-up"></i></button>
      <form method="post" action="#">
        <div className="form-group">
          <input id="search1" type="search" name="search-field" defaultValue="" placeholder="Search..." required />
          <button type="submit"><i className="fa fa-search"></i></button>
        </div>
      </form>
    </div>
  );
}
