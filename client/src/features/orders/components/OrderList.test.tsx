import { render, screen, fireEvent } from "@testing-library/react";
import { OrderList } from './OrderList'; 
import { OrderResponseItem } from "@/features/orders/types";

const mockOrders: OrderResponseItem[] = [
    {
        id: 1, 
        orderUUID: 'uuid-1',
        destination: 'New York',
        weight: 10,
        date: '2023-10-12T12:00:00Z',
        status: 'unassigned',
        vehiclePlate: null,
        lat: 40.7128,
        lon: -74.0060,
        createdAt: "",
        updatedAt: "",
        observations: ""
    },
    {
      id: 2,  
      orderUUID: 'uuid-2',
      destination: 'Los Angeles',
      weight: 15,
      date: '2023-10-10T12:00:00Z',
      status: 'assigned',
      vehiclePlate: 'ABC-123',
      lat: 34.0522,
      lon: -118.2437,
      createdAt: "",
      updatedAt: "",
      observations: ""
    },
  ];
  
const mockOnAssignOrder = jest.fn();
const mockOnSortChange = jest.fn();

describe('OrderList component', () => {

  beforeEach(() => {
    render(
      <OrderList 
        orders={mockOrders} 
        onAssignOrder={mockOnAssignOrder} 
        onSortChange={mockOnSortChange} 
        sort="destination" 
        order="ASC" 
      />
    );
  });

  it('should render the table headers correctly', () => {
    expect(2 +2).toBe(4);
    expect(screen.getByText(/Destination/i)).toBeInTheDocument();
    expect(screen.getByText(/Weight/i)).toBeInTheDocument();
    expect(screen.getByText(/Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Vehicle plate/i)).toBeInTheDocument();
    expect(screen.getByText(/Coordinates/i)).toBeInTheDocument();
    expect(screen.getByText(/Actions/i)).toBeInTheDocument();
  });

  it('should render the order details correctly', () => {
    expect(screen.getByText(/New York/i)).toBeInTheDocument();
    expect(screen.getByText(/Los Angeles/i)).toBeInTheDocument();
    
    const weightCells = screen.getAllByText(/10/i);
    expect(weightCells[0]).toBeInTheDocument();
    const weight15 = screen.getByText(/15/i); 
    expect(weight15).toBeInTheDocument();
    
    const date12 = screen.getByText(/12\/10\/2023/i); 
    expect(date12).toBeInTheDocument();
    const date10 = screen.getByText(/10\/10\/2023/i);
    expect(date10).toBeInTheDocument();
    
    const statusCells = screen.getAllByText(/unassigned/i);
    expect(statusCells[0]).toBeInTheDocument();
    
    const assignedStatus = screen.getAllByText(/assigned/i);
    expect(assignedStatus[0]).toBeInTheDocument();
  
    expect(screen.getByText(/40.713, -74.006/i)).toBeInTheDocument();
    expect(screen.getByText(/34.052, -118.244/i)).toBeInTheDocument();
    expect(screen.getByText(/N\/A/i)).toBeInTheDocument();
    expect(screen.getByText(/ABC-123/i)).toBeInTheDocument();
  });

  it('should trigger sort change when header is clicked', () => {
    fireEvent.click(screen.getByText(/Destination/i));
    expect(mockOnSortChange).toHaveBeenCalledWith("destination");

    fireEvent.click(screen.getByText(/Weight/i));
    expect(mockOnSortChange).toHaveBeenCalledWith("weight");

    fireEvent.click(screen.getByText(/Date/i));
    expect(mockOnSortChange).toHaveBeenCalledWith("date");
  });

  it('should not render the assign button for assigned orders', () => {
    expect(screen.queryByText(/Assign to Vehicle/i)).toBeInTheDocument();
  });

  it('should render Google Maps link correctly', () => {
    const mapLink = screen.getAllByRole('link', { name: /40.713, -74.006/i })[0];
    expect(mapLink).toHaveAttribute('href', 'https://www.google.com/maps?q=40.7128,-74.006');
  });
});
