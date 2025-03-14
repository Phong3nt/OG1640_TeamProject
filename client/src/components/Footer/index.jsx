import "./footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <h3 className="footer-title">My Account</h3>
          <ul className="footer-links">
            <li><a href="/account">Schedule</a></li>
            <li><a href="/account">Profile</a></li>
            <li><a href="/blogs">Blogs</a></li>
          </ul>
        </div>


        <div className="hidden sm:block">
          <h3 className="footer-title">Our Client Says</h3>
          <p className="text-gray-300">Excellent company! I would recommend it to everyone.</p>
        </div>

        <div>
          <h3 className="footer-title">Contact Info</h3>
          <ul className="footer-contact">
            <li><i className="fas fa-map-marker-alt"></i> 12 Nguyen Thi Dinh, Da Nang</li>
            <li><i className="fas fa-phone"></i> Phone: (+84) 787 739 048</li>
            <li><i className="fas fa-envelope"></i> Email: minhhq102003@gmail.com</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-social">
          <a href="https://www.facebook.com/ngvuq.11" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
        <p>© 2024 Vintage Store. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
