import React, { useState, useRef } from 'react';
import { APIProvider, Map, Pin, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import type { MapMouseEvent } from '@vis.gl/react-google-maps';
import './App.css'
import '@govtechsg/sgds/css/sgds.css';


type britTroops = { key: string, location: google.maps.LatLngLiteral }
const locations: britTroops[] = [
    { key: "Singapore", location: { lat: 0, lng: 0 } },
];


const symbolTemplates: Record<string, string> = {
    infantry: `<rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" stroke-width="4"/>
    <line x1="30" y1="30" x2="70" y2="70" stroke="currentColor" stroke-width="4"/>
    <line x1="70" y1="30" x2="30" y2="70" stroke="currentColor" stroke-width="4"/>`,
    armor: `<rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" stroke-width="4"/>
    <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" stroke-width="4"/>`,
    artillery: `<rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" stroke-width="4"/>
    <circle cx="50" cy="50" r="20" fill="currentColor"/>`,
    reconnaissance: `<rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" stroke-width="4"/>
    <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" stroke-width="4"/>
    <line x1="50" y1="25" x2="50" y2="75" stroke="currentColor" stroke-width="3"/>`,
    aerial: `<rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" stroke-width="4"/>
    <path d="M 30,50 L 50,30 L 70,50 L 50,70 Z" fill="none" stroke="currentColor" stroke-width="4"/>`,
};

const COLORS = [
    { name: 'BLUE', value: '#0066FF', title: 'Blue - Friendly Forces' },
    { name: 'RED', value: '#FF0000', title: 'Red - Hostile Forces' },
    { name: 'GREEN', value: '#00FF00', title: 'Green - Neutral Forces' },
    { name: 'YELLOW', value: '#FFFF00', title: 'Yellow - Unknown Forces' },
    { name: 'WHITE', value: '#FFFFFF', title: 'White - Assumed Friendly' },
    { name: 'PURPLE', value: '#800080', title: 'Purple - Exercise/Joker' },
    { name: 'ORANGE', value: '#FFA500', title: 'Orange - Suspect' },
    { name: 'GRAY', value: '#808080', title: 'Gray - Pending' },
];

const UNIT_TYPES = [
    { type: 'infantry', label: 'INF', svg: symbolTemplates.infantry },
    { type: 'armor', label: 'ARM', svg: symbolTemplates.armor },
    { type: 'artillery', label: 'ART', svg: symbolTemplates.artillery },
    { type: 'reconnaissance', label: 'REC', svg: symbolTemplates.reconnaissance },
    { type: 'aerial', label: 'AIR', svg: symbolTemplates.aerial },
];



function Editor() {


    const [selectedColor, setSelectedColor] = useState('#0066FF');
    const [units, setUnits] = useState<any[]>([]);
    const [draggedUnit, setDraggedUnit] = useState<any | null>(null);
    const [contextMenu, setContextMenu] = useState<{ visible: boolean, x: number, y: number, unitId: string | null }>({ visible: false, x: 0, y: 0, unitId: null });
    const mapOverlayRef = useRef<HTMLDivElement>(null);

    // Drag from palette
    const handleDragStartPalette = (unitType: string, type: string) => (e: React.DragEvent) => {
        setDraggedUnit({ symbol: unitType, type, color: selectedColor });
        e.dataTransfer.effectAllowed = 'copy';
    };

    // Drop on map
    const handleDropMap = (e: React.DragEvent) => {
        e.preventDefault();
        if (!draggedUnit) return;
        const rect = mapOverlayRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left - 25;
        const y = e.clientY - rect.top - 25;
        setUnits(units => [
            ...units,
            {
                id: 'unit-' + (units.length + 1),
                symbol: draggedUnit.symbol,
                type: draggedUnit.type,
                color: draggedUnit.color,
                x: Math.max(0, Math.min(x, rect.width - 50)),
                y: Math.max(0, Math.min(y, rect.height - 50)),
            }
        ]);
        setDraggedUnit(null);
    };

    // Drag over map
    const handleDragOverMap = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = draggedUnit ? 'copy' : 'move';
    };

    // Drag start unit on map
    const handleDragStartUnit = (unitId: string) => (e: React.DragEvent) => {
        e.dataTransfer.setData('unitId', unitId);
        e.dataTransfer.effectAllowed = 'move';
    };

    // Drop unit on map (move)
    const handleDropMoveUnit = (e: React.DragEvent) => {
        const unitId = e.dataTransfer.getData('unitId');
        if (unitId) {
            e.preventDefault();
            const rect = mapOverlayRef.current!.getBoundingClientRect();
            const x = e.clientX - rect.left - 25;
            const y = e.clientY - rect.top - 25;
            setUnits(units =>
                units.map(u =>
                    u.id === unitId
                        ? { ...u, x: Math.max(0, Math.min(x, rect.width - 50)), y: Math.max(0, Math.min(y, rect.height - 50)) }
                        : u
                )
            );
        }
    };

    const handleContextMenuUnit = (unitId: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        if (mapOverlayRef.current) {
            // position the context menu near the click (adjust as needed)
            const x = e.clientX - 50;
            const y = e.clientY - 50;

            setContextMenu({
                visible: true,
                x,
                y,
                unitId
            });
        }
    };

    const handleHideContextMenu = () => {
        setContextMenu({
            visible: false,
            x: contextMenu.x,
            y: contextMenu.y,
            unitId: null
        });
    };


    // Delete unit
    const handleDeleteUnit = () => {
        if (contextMenu.unitId) {
            setUnits(units => units.filter(u => u.id !== contextMenu.unitId));
            handleHideContextMenu();
        }
    };

    // Stats
    const stats = {
        infantry: units.filter(u => u.type === 'infantry').length,
        heavy: units.filter(u => u.type === 'armor' || u.type === 'artillery').length,
        recon: units.filter(u => u.type === 'reconnaissance').length,
        aerial: units.filter(u => u.type === 'aerial').length,
        total: units.length,
    };

    const [clickedPosition, setClickedPosition] = useState<google.maps.LatLngLiteral | null>(null);

    const handleMapClick = (event: MapMouseEvent) => {
        if (event.detail.latLng) {
            const lat = event.detail.latLng.lat;
            const lng = event.detail.latLng.lng;
            setClickedPosition({ lat, lng });
            console.log('Clicked coordinates:', { lat, lng });
        }
    };


    return (<>

        <div className="topBar">
            <h1>Joint Cabinet Crisis</h1>
            <a className='topBarLinks' href="#/">Updates</a>
            <a className='topBarLinks' href="https://forms.gle/9QhMmUZhjLAE5cXTA" target='blank'>Directive Form</a>
            <a className='topBarLinks' href="#/editor">Map Editor</a>
            <a className='topBarLinks' href="#/council-directives">Council Directives</a>
        </div>
        <div className="header">
            <h1>Troop Map Editor</h1>
        </div>
        <div className="container">
            <div className="sidebar">
                <h3>Unit Symbols</h3>
                <div className="unit-palette">
                    {UNIT_TYPES.map(u => (
                        <div
                            key={u.type}
                            className={`unit-item ${u.type}`}
                            draggable
                            onDragStart={handleDragStartPalette(u.type, u.type)}
                            data-type={u.type}
                            data-symbol={u.type}
                            title={`${u.label} Unit`}
                        >
                            <svg viewBox="0 0 100 100" dangerouslySetInnerHTML={{ __html: u.svg }} />
                            <div className="unit-label">{u.label}</div>
                        </div>
                    ))}
                </div>
                <h3>Colors</h3>
                <div className="color-controls">
                    <div className="color-grid">
                        {COLORS.map(c => (
                            <div
                                key={c.value}
                                className={`color-option${selectedColor === c.value ? ' selected' : ''}`}
                                style={{ background: c.value }}
                                title={c.title}
                                onClick={() => setSelectedColor(c.value)}
                            >
                            </div>
                        ))}
                    </div>
                </div>
                <div className="stats">
                    <strong>Unit Deployment:</strong><br />
                    Infantry: <span id="infantry-count">{stats.infantry}</span><br />
                    Armor/Artillery: <span id="tank-count">{stats.heavy}</span><br />
                    Recon: <span>{stats.recon}</span><br />
                    Aerial: <span id="aerial-count">{stats.aerial}</span><br />
                    <strong>Total: <span id="total-count">{stats.total}</span></strong>
                </div>
                <div className="instructions">
                    <strong>Operations Manual:</strong><br />
                    • Select allegiance color first<br />
                    • Drag symbols onto map<br />
                    • Reposition units by dragging<br />
                    • Right-click to delete units<br />
                </div>
            </div>
            <div
                className="map-container"
                onDragOver={handleDragOverMap}
                onDrop={e => {
                    if (draggedUnit) handleDropMap(e);
                    else handleDropMoveUnit(e);
                }}
            >

                <div className="map-overlay" id="mapOverlay" ref={mapOverlayRef} style={{ padding: "0px" }} >

                    <APIProvider apiKey={'AIzaSyDdBGrtXdcOkvVC37W-WoCQIK9TjAwYGUs'} onLoad={() => console.log('Maps API has loaded.')}>

                        <Map
                            className='map-image'
                            defaultZoom={11}
                            mapId='eb87b183946a00eea25854ea'
                            defaultCenter={{ lat: 1.3521, lng: 103.8193 }}
                            onClick={handleMapClick}
                            disableDefaultUI={true}
                            gestureHandling="auto"

                        >
                            <PoiMarkers pois={locations} />

                            {clickedPosition && (
                                <InfoWindow
                                    position={clickedPosition}
                                    onCloseClick={() => setClickedPosition(null)}
                                >
                                    <div style={{ padding: '8px' }}>
                                        <strong>Clicked Location</strong><br />
                                        lat: {clickedPosition.lat.toFixed(6)}<br />
                                        lng: {clickedPosition.lng.toFixed(6)}
                                    </div>
                                </InfoWindow>
                            )}
                        </Map>

                    </APIProvider>
                    {units.map(unit => (
                        <div
                            id={unit.id}
                            key={unit.id}
                            className="unit-on-map"
                            style={{
                                left: unit.x,
                                top: unit.y,
                                borderColor: unit.color,
                                color: unit.color,
                                position: 'absolute',
                                cursor: 'move',
                            }}
                            draggable
                            onDragStart={handleDragStartUnit(unit.id)}
                            onContextMenu={handleContextMenuUnit(unit.id)}
                        >
                            <svg viewBox="0 0 100 100" dangerouslySetInnerHTML={{ __html: symbolTemplates[unit.symbol] }} />
                        </div>
                    ))}
                </div>
            </div>
        </div >
        {
            contextMenu.visible && (
                <div
                    className="context-menu"
                    style={{
                        display: 'block',
                        position: 'absolute',
                        left: contextMenu.x,
                        top: contextMenu.y,
                        zIndex: 1000,
                        background: '#fff',
                        border: '1px solid #ccc',
                        padding: '8px',
                    }}
                    onClick={handleDeleteUnit}
                    onMouseLeave={handleHideContextMenu}
                >
                    <div className="context-menu-item" id="deleteUnit">Delete Unit</div>
                </div>
            )
        }
    </>
    )


}

const PoiMarkers = (props: { pois: britTroops[] }) => {
    return (
        <>
            {props.pois.map((poi: britTroops) => (
                <AdvancedMarker
                    key={poi.key}
                    position={poi.location}>
                    <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
                </AdvancedMarker>
            ))}
        </>
    );
};

export default Editor;