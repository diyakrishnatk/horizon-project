import React, { useState, useContext } from 'react';
import { Container, Row, Col, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import useFetch from '../../hooks/useFetch';
import { BASE_URL } from '../../utils/config';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin-dashboard.css';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [modal, setModal] = useState(false);
    const [newTour, setNewTour] = useState({
        title: '', city: '', address: '', distance: 0, photo: '',
        desc: '', price: 0, maxGroupSize: 0, featured: false
    });

    const [reportPeriod, setReportPeriod] = useState('monthly');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const { data: tours, loading: loadingTours, error: errorTours, reFetch: reFetchTours } = useFetch(`${BASE_URL}/tours`);
    const { data: bookings } = useFetch(`${BASE_URL}/booking`);
    const { data: usersData } = useFetch(`${BASE_URL}/users`);

    // Dynamic Tracking Logic
    const getFilteredBookings = () => {
        if (!bookings) return [];
        const now = new Date();
        return bookings.filter(b => {
            const bDate = new Date(b.bookAt);
            if (reportPeriod === 'today') {
                return bDate.toDateString() === now.toDateString();
            } else if (reportPeriod === 'weekly') {
                const weekAgo = new Date(); weekAgo.setDate(now.getDate() - 7);
                return bDate >= weekAgo;
            } else if (reportPeriod === 'monthly') {
                return bDate.getMonth() === now.getMonth() && bDate.getFullYear() === now.getFullYear();
            } else if (reportPeriod === 'annual') {
                return bDate.getFullYear() === now.getFullYear();
            } else if (reportPeriod === 'custom') {
                return bDate.toISOString().split('T')[0] === selectedDate;
            }
            return true;
        });
    };

    const filteredBookings = Array.isArray(bookings) ? getFilteredBookings() : [];
    const periodRevenue = filteredBookings.reduce((acc, b) => acc + (Number(b.guestSize || 0) * 5000), 0);

    const lifetimeRevenue = Array.isArray(bookings) ? bookings.reduce((acc, b) => acc + (Number(b.guestSize || 0) * 5000), 0) : 0;
    const lifetimeOrders = Array.isArray(bookings) ? bookings.length : 0;
    const totalUsers = Array.isArray(usersData) ? usersData.length : 0;

    if (user?.role !== 'admin') {
        return (
            <div className="executive-suite d-flex align-items-center justify-content-center">
                <div className="text-center p-5 suite-card">
                    <h1 className="display-1 text-brass fw-bold">403</h1>
                    <h3 className="fw-bold mb-4">ACCESS RESTRICTED</h3>
                    <p className="text-muted mb-4">Authorized Administrative Personnel Only.</p>
                    <Button color="dark" className="btn-add-luxe" onClick={() => navigate('/admin_login')}>AUTHENTICATE NOW</Button>
                </div>
            </div>
        );
    }

    const toggleModal = () => setModal(!modal);

    const handleFormChange = e => {
        const { id, value, type, checked } = e.target;
        setNewTour(prev => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
    };

    const handleCreateTour = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BASE_URL}/tours`, {
                method: 'post',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(newTour),
            });
            if (res.ok) {
                alert('Listing Synchronized Successfully.');
                toggleModal();
                reFetchTours();
            } else {
                alert('Synchronization Failed.');
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const scrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="executive-suite">
            {/* Navigational Sidebar */}
            <aside className="exec-sidebar">
                <div className="exec-brand text-center d-flex align-items-center justify-content-center gap-2">
                    <i className="ri-shield-user-line text-brass"></i> HORIZON HUB
                </div>
                <nav className="flex-grow-1">
                    <a href="#overview" className="exec-link active d-flex align-items-center" onClick={() => scrollTo('overview')}>
                        <i className="ri-dashboard-3-line"></i> STRATEGIC OVERVIEW
                    </a>
                    <a href="#reports" className="exec-link d-flex align-items-center" onClick={() => scrollTo('reports')}>
                        <i className="ri-bar-chart-2-line"></i> REVENUE ANALYTICS
                    </a>
                    <a href="#inventory" className="exec-link d-flex align-items-center" onClick={() => scrollTo('inventory')}>
                        <i className="ri-suitcase-2-line"></i> GLOBAL INVENTORY
                    </a>
                    <a href="#bookings" className="exec-link d-flex align-items-center" onClick={() => scrollTo('bookings')}>
                        <i className="ri-calendar-check-line"></i> BOOKING FLOW
                    </a>
                    <a href="#customers" className="exec-link d-flex align-items-center" onClick={() => scrollTo('customers')}>
                        <i className="ri-user-settings-line"></i> CUSTOMER BASE
                    </a>
                </nav>
                <div className="mt-auto">
                    <Button color="link" className="exec-link text-brass d-flex align-items-center" onClick={() => navigate('/')}>
                        <i className="ri-logout-box-line"></i> RETURN TO PORTAL
                    </Button>
                </div>
            </aside>

            {/* Main Operational Surface */}
            <main className="exec-main">
                <header className="exec-header d-flex justify-content-between align-items-center">
                    <div id="overview">
                        <h1 className="exec-title">ADMINISTRATIVE HUB</h1>
                        <p className="exec-tagline">Operating Environment: LUXE-WHITE EXECUTIVE SUITE</p>
                    </div>
                    <Button className="btn-add-luxe shadow d-flex align-items-center gap-2" onClick={toggleModal}>
                        <i className="ri-add-line"></i> NEW LISTING
                    </Button>
                </header>

                <Row className="mb-5 g-4 align-items-stretch">
                    <Col lg="3" md="6" onClick={() => scrollTo('inventory')} className="cursor-pointer">
                        <div className="suite-card text-center h-100 d-flex flex-column justify-content-center py-5">
                            <i className="ri-map-pin-line fs-1 text-brass mb-3 opacity-25"></i>
                            <div className="suite-label mb-2">Live Packages</div>
                            <div className="suite-metric">{tours?.length || 0}</div>
                        </div>
                    </Col>
                    <Col lg="3" md="6" onClick={() => scrollTo('reports')} className="cursor-pointer">
                        <div className="suite-card text-center h-100 d-flex flex-column justify-content-center py-5">
                            <i className="ri-money-dollar-circle-line fs-1 text-brass mb-3 opacity-25"></i>
                            <div className="suite-label mb-2">Total Sales (LIFETIME)</div>
                            <div className="suite-metric">₹ {lifetimeRevenue.toLocaleString()}</div>
                        </div>
                    </Col>
                    <Col lg="3" md="6" onClick={() => scrollTo('customers')} className="cursor-pointer">
                        <div className="suite-card text-center h-100 d-flex flex-column justify-content-center py-5">
                            <i className="ri-team-line fs-1 text-brass mb-3 opacity-25"></i>
                            <div className="suite-label mb-2">Total Customer Base</div>
                            <div className="suite-metric">{totalUsers}</div>
                        </div>
                    </Col>
                    <Col lg="3" md="6" onClick={() => scrollTo('reports')} className="cursor-pointer">
                        <div className="suite-card text-center h-100 d-flex flex-column justify-content-center py-5">
                            <i className="ri-radar-line fs-1 text-brass mb-3 opacity-25"></i>
                            <div className="suite-label mb-2">Global Volume</div>
                            <div className="suite-metric">{lifetimeOrders} Orders</div>
                        </div>
                    </Col>
                </Row>

                {/* Professional Operational Intelligence Console */}
                <div className="suite-card p-0 overflow-hidden mb-5 shadow-lg" id="reports" style={{ scrollMarginTop: '100px', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
                    <div className="px-5 py-5 d-flex justify-content-between align-items-center flex-wrap gap-4 border-bottom" style={{ background: '#fff' }}>
                        <div>
                            <h3 className="fw-900 mb-1 text-navy" style={{ letterSpacing: '-1px' }}>REVENUE FLOW ANALYTICS</h3>
                            <p className="text-muted small fw-bold mb-0">Systemic Pulse: Dynamic Data Sync Active</p>
                        </div>
                        <div className="d-flex gap-2">
                            {['today', 'weekly', 'monthly', 'annual', 'custom'].map(p => (
                                <button 
                                    key={p}
                                    onClick={() => setReportPeriod(p)}
                                    className={`btn-exec-filter ${reportPeriod === p ? 'active' : ''}`}
                                >
                                    {p.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="p-5 bg-white">
                        <Row className="g-4 mb-5">
                            <Col lg="3" md="6">
                                <div className="report-metric-tile bg-light p-4 rounded-4 text-center border">
                                    <div className="text-brass fw-900 small uppercase mb-2">Total System Revenue</div>
                                    <h2 className="fw-900 text-navy mb-0">₹ {periodRevenue.toLocaleString()}</h2>
                                </div>
                            </Col>
                            <Col lg="3" md="6">
                                <div className="report-metric-tile bg-light p-4 rounded-4 text-center border">
                                    <div className="text-primary fw-900 small uppercase mb-2">Transaction Volume</div>
                                    <h2 className="fw-900 text-navy mb-0">{filteredBookings.length} Orders</h2>
                                </div>
                            </Col>
                            <Col lg="3" md="6">
                                <div className="report-metric-tile bg-light p-4 rounded-4 text-center border">
                                    <div className="text-info fw-900 small uppercase mb-2">Avg Order Value</div>
                                    <h2 className="fw-900 text-navy mb-0">₹ {(periodRevenue / (filteredBookings.length || 1)).toFixed(0).toLocaleString()}</h2>
                                </div>
                            </Col>
                            <Col lg="3" md="6">
                                <div className="p-4 rounded-4 text-center border h-100 d-flex flex-column justify-content-center">
                                    <Label className="small fw-bold text-muted uppercase mb-2">Filter Calendar</Label>
                                    <Input type="date" className="fw-bold border-0 bg-transparent text-center" value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setReportPeriod('custom'); }} />
                                </div>
                            </Col>
                        </Row>

                        <div className="rounded-4 overflow-hidden border">
                            <Table responsive hover className="luxe-table mb-0 border-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="ps-4">Transaction Date</th>
                                        <th>Target Listing</th>
                                        <th>Customer Identity</th>
                                        <th>Contact</th>
                                        <th>Group Size</th>
                                        <th>Revenue Snapshot</th>
                                        <th className="pe-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {filteredBookings.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center p-5 text-muted fw-bold">NO TRANSACTIONS RECORDED FOR THE SELECTED TIMEFRAME</td>
                                        </tr>
                                    ) : (
                                        filteredBookings.map(b => (
                                            <tr key={b._id}>
                                                <td className="ps-4 fw-bold">{new Date(b.bookAt).toLocaleDateString()}</td>
                                                <td><span className="fw-900 text-navy">{b.tourName}</span></td>
                                                <td className="fw-bold">{b.fullName}</td>
                                                <td className="text-muted">{b.phone}</td>
                                                <td className="text-center fw-900 text-primary">{b.guestSize} Pax</td>
                                                <td className="text-success fw-900">₹ {(b.guestSize * 5000).toLocaleString()}</td>
                                                <td className="pe-4 text-center">
                                                    <span className="px-3 py-2 rounded-3 bg-light text-success fw-900 small shadow-sm border border-success opacity-75">
                                                        AUTHORIZED ✓
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>

                {/* Inventory Management */}
                <div className="suite-card p-0 overflow-hidden mb-5" id="inventory" style={{ scrollMarginTop: '100px' }}>
                    <div className="px-4 py-4 bg-light border-bottom">
                        <h4 className="fw-bold mb-0">GLOBAL INVENTORY REPOSITORY</h4>
                    </div>
                    <Table responsive hover className="luxe-table mb-0">
                        <thead>
                            <tr>
                                <th>Listing Title</th>
                                <th>Destination</th>
                                <th>Market Price</th>
                                <th>Capacity</th>
                                <th>Featured Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tours?.map(tour => (
                                <tr key={tour._id}>
                                    <td className="fw-bold">{tour.title}</td>
                                    <td>{tour.city}</td>
                                    <td className="text-success fw-bold">₹ {tour.price}</td>
                                    <td className="fw-bold">{tour.maxGroupSize} Guests</td>
                                    <td>
                                        {tour.featured ? 
                                            <span className="exec-badge bg-brass text-white shadow-sm">🌟 FEATURED</span> : 
                                            <span className="exec-badge bg-light text-muted border">Standard</span>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

                <Row>
                    <Col lg="6" id="bookings" style={{ scrollMarginTop: '100px' }}>
                        <div className="suite-card p-0 overflow-hidden mb-5">
                            <div className="px-4 py-4 bg-light border-bottom">
                                <h4 className="fw-bold mb-0">BOOKING FLOW</h4>
                            </div>
                            <Table responsive hover className="luxe-table mb-0">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Target Tour</th>
                                        <th>Group</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings?.slice(0, 5).map(b => (
                                        <tr key={b._id}>
                                            <td className="fw-bold">{new Date(b.bookAt).toLocaleDateString()}</td>
                                            <td>{b.tourName}</td>
                                            <td>{b.guestSize} Pax</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                    <Col lg="6" id="customers" style={{ scrollMarginTop: '100px' }}>
                        <div className="suite-card p-0 overflow-hidden mb-5">
                            <div className="px-4 py-4 bg-light border-bottom">
                                <h4 className="fw-bold mb-0">CUSTOMER BASE</h4>
                            </div>
                            <Table responsive hover className="luxe-table mb-0">
                                <thead>
                                    <tr>
                                        <th>Identity</th>
                                        <th>Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usersData?.slice(0, 5).map(u => (
                                        <tr key={u._id}>
                                            <td className="fw-bold">{u.username}</td>
                                            <td><span className={`exec-badge bg-navy text-white`}>{u.role}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
            </main>

            <Modal isOpen={modal} toggle={toggleModal} centered size="lg">
                <ModalHeader toggle={toggleModal} className="border-0 pb-0">
                    <h2 className="fw-bold px-4 pt-4">NEW LISTING PROTOCOL</h2>
                </ModalHeader>
                <Form onSubmit={handleCreateTour}>
                    <ModalBody className="p-5">
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Label className="small fw-bold">LISTING TITLE</Label>
                                    <Input type="text" id="title" value={newTour.title} onChange={handleFormChange} placeholder="Enter destination title..." required />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label className="small fw-bold">MARKET PRICE (₹)</Label>
                                    <Input type="number" id="price" value={newTour.price} onChange={handleFormChange} required />
                                </FormGroup>
                            </Col>
                        </Row>
                        {/* Simplified for demo, full fields can be added back if needed */}
                        <p className="text-muted small">Please ensure all administrative fields are validated before synchronization.</p>
                    </ModalBody>
                    <ModalFooter className="border-0 p-4">
                        <Button color="light" onClick={toggleModal} className="fw-bold">ABORT</Button>
                        <Button color="dark" type="submit" className="btn-add-luxe px-5">SYNC LISTING</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
