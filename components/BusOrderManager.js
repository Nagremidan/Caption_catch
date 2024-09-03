import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import { Button } from '@/components/ui/button';

const SortableItem = ({ id, value, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} className="flex items-center justify-between p-3 mb-2 bg-gray-100 rounded touch-manipulation">
      <div className="flex items-center flex-grow">
        <span {...attributes} {...listeners} className="cursor-move mr-3 text-xl px-2">☰</span>
        <span className="truncate">{value}</span>
      </div>
      <button
        onClick={() => onRemove(id)}
        className="ml-2 px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
      >
        Remove
      </button>
    </li>
  );
};

const BusOrderManager = () => {
  const [busOrder, setBusOrder] = useState([]);
  const [newBus, setNewBus] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    fetchBusOrder();
  }, []);

  const fetchBusOrder = async () => {
    setIsLoading(true);
    try {
      const docRef = doc(db, 'settings', 'busOrder');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBusOrder(docSnap.data().order);
      } else {
        // If no order exists, set the default order
        const defaultOrder = [
          'NO 1 LORRY',
          'SURYA BUS',
          'A1 BUS',
          'CITY TIRCHY',
          'VIVEGAM TUTICORIN',
          'PSS CHENNAI',
          'PSS OFFICE',
          'PSS DINDUGAL',
          'PSS TIRUPUR',
          'PSS SALEM',
          'PSS VELLORE',
          'PSS NAGERKOVIL',
          'OMNI BUS STAND',
          'GANDHIPURAM',
          'NEW BUS STAND',
          'THUDIYALUR'
        ];
        await setDoc(docRef, { order: defaultOrder });
        setBusOrder(defaultOrder);
      }
    } catch (error) {
      console.error('Error fetching bus order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveBusOrder = async (newOrder) => {
    try {
      const docRef = doc(db, 'settings', 'busOrder');
      await setDoc(docRef, { order: newOrder });
    } catch (error) {
      console.error('Error saving bus order:', error);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setBusOrder((items) => {
        const oldIndex = items.findIndex((item) => item === active.id);
        const newIndex = items.findIndex((item) => item === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        saveBusOrder(newOrder);
        return newOrder;
      });
    }
  };

  const addBus = () => {
    if (newBus.trim() !== '' && !busOrder.includes(newBus.trim())) {
      const updatedOrder = [...busOrder, newBus.trim()];
      setBusOrder(updatedOrder);
      saveBusOrder(updatedOrder);
      setNewBus('');
    }
  };

  const removeBus = (busName) => {
    const updatedOrder = busOrder.filter(bus => bus !== busName);
    setBusOrder(updatedOrder);
    saveBusOrder(updatedOrder);
  };

  const handleInputChange = (e) => {
    setNewBus(e.target.value.toUpperCase());
  };

  if (isLoading) {
    return <div>Loading bus order...</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Bus Order Manager</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={newBus}
          onChange={handleInputChange}
          placeholder="ADD NEW BUS"
          className="flex-grow mr-2 p-2 border border-gray-300 rounded uppercase"
        />
        <Button onClick={addBus} className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
          Add
        </Button>
      </div>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={busOrder}
          strategy={verticalListSortingStrategy}
        >
          <ul className="list-none p-0">
            {busOrder.map((bus) => (
              <SortableItem key={bus} id={bus} value={bus} onRemove={removeBus} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default BusOrderManager;