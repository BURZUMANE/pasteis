import { render, screen, fireEvent } from "@testing-library/react";
import { OrderList } from "./OrderList";
import { OrderResponseItem } from "@/features/orders/types";
import { TableCell } from "@mui/material";

// Mock data
const mockOrders: OrderResponseItem[] = [
  {
    id: 1, // id as number
    destination: "New York",
    weight: 500,
    date: new Date().toISOString(),
    observations: "Deliver by 5pm",
    status: "unassigned",
    vehicleSchedule: null,
    lat: 40.7128,
    lon: -74.0060,
    orderUUID: "123",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    vehiclePlate: null,
  },
  {
    id: 2, // id as number
    destination: "Los Angeles",
    weight: 300,
    date: new Date().toISOString(),
    observations: "",
    status: "assigned",
    vehicleSchedule: {
      id: 1, // VehicleSchedule ID
      date: new Date().toISOString(), // Example date
      loadedCapacity: 500, // Loaded capacity
      vehicleId: 1, // Vehicle ID reference
      vehicle: {
        id: 1,
        vehiclePlate: "ABC123",
        maxCapacity: 1000,
        availableCapacity: 500,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    } as any,
    lat: 34.0522,
    lon: -118.2437,
    orderUUID: "456",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    vehiclePlate: "ABC123",
  },
];

// Mock functions
const mockOnAssignOrder = jest.fn();
const mockOnSortChange = jest.fn();
const mockOnUpdateObservations = jest.fn();

describe("OrderList", () => {
  beforeEach(() => {
    render(
      <OrderList
        orders={mockOrders}
        onAssignOrder={mockOnAssignOrder}
        onSortChange={mockOnSortChange}
        onUpdateObservations={mockOnUpdateObservations}
        sort="destination"
        order="ASC"
      />
    );
  });

  test("renders order data correctly", () => {
    expect(screen.getByText("New York")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByText("Deliver by 5pm")).toBeInTheDocument();
    expect(screen.getByText("Los Angeles")).toBeInTheDocument();
    expect(screen.getByText("300")).toBeInTheDocument();
    expect(screen.getByText("ABC123")).toBeInTheDocument();
  });

  test("calls onSortChange when a header is clicked", () => {
    const destinationHeader = screen.getByText("Dest Name");
    fireEvent.click(destinationHeader);
    expect(mockOnSortChange).toHaveBeenCalledWith("destination");

    const weightHeader = screen.getByText("Weight (kg)");
    fireEvent.click(weightHeader);
    expect(mockOnSortChange).toHaveBeenCalledWith("weight");
  });

  test("calls onAssignOrder when Assign button is clicked", () => {
    const assignButton = screen.getByText("Assign");
    fireEvent.click(assignButton);
    expect(mockOnAssignOrder).toHaveBeenCalledWith("123");
  });


  test("displays Google Maps link correctly", () => {
    const link = screen.getByText("40.713, -74.006");
    expect(link.closest("a")).toHaveAttribute(
      "href",
      "https://www.google.com/maps?q=40.7128,-74.006"
    );
  });
});
