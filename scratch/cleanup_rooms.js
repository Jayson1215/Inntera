
const API_BASE = 'http://localhost:8000/api';

async function cleanupRooms() {
    try {
        const response = await fetch(`${API_BASE}/rooms`);
        const result = await response.json();
        if (!result.success) throw new Error('Failed to fetch rooms');
        
        const rooms = result.data;
        const seen = new Set();
        const toDelete = [];

        rooms.forEach(room => {
            const key = `${room.hotel_id}-${room.floor}`;
            if (seen.has(key)) {
                toDelete.push(room.room_id);
            } else {
                seen.add(key);
            }
        });

        console.log(`Found ${toDelete.length} rooms to delete.`);

        for (const id of toDelete) {
            console.log(`Deleting room ${id}...`);
            await fetch(`${API_BASE}/rooms/${id}`, { method: 'DELETE' });
        }

        console.log('Cleanup complete.');
    } catch (error) {
        console.error('Error:', error);
    }
}

cleanupRooms();
