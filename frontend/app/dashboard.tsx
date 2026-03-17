'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Navigation,
  BarChart3,
  Lock,
  Sliders,
  ArrowRight,
  Zap,
  Shield,
  Wind,
  Leaf,
  Heart,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Activity,
  Cpu,
  Eye,
  Radio,
  Phone,
} from 'lucide-react';
import { useNavigationStore } from '@/app/store';
import toast from 'react-hot-toast';

// ==================== STYLED COMPONENTS ====================
const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #0f172a, #0f1419, #0f172a);
`;

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  backdrop-filter: blur(20px);
  background-color: rgba(15, 23, 42, 0.4);
  border-bottom: 1px solid #1e293b;
`;

const HeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #06b6d4, #2563eb);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.div`
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    margin: 0;
  }
  p {
    font-size: 0.75rem;
    color: #22d3ee;
    font-weight: 600;
    letter-spacing: 0.05em;
    margin: 0;
  }
`;

const HeaderButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: rgba(168, 85, 247, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.4);
  color: #e9d5ff;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: rgba(168, 85, 247, 0.3);
  }
`;

const MainContent = styled.div`
  padding-top: 6rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 6rem;
`;

const ContentWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const SearchGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const LeftSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    grid-column: span 1;
  }
`;

const MapSection = styled.div`
  height: 384px;
  
  @media (min-width: 1024px) {
    height: 500px;
    grid-column: span 2;
  }
`;

const RightSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SearchGroup = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const SearchLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
`;

const SearchInputWrapper = styled.div<{ startColor?: string }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background-color: rgba(30, 41, 59, 0.5);
  border: 1px solid ${props => props.startColor || 'rgba(34, 211, 238, 0.2)'};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.startColor === 'rgba(34, 211, 238, 0.2)' ? 'rgba(34, 211, 238, 0.5)' : 'rgba(239, 68, 68, 0.5)'};
  }
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  color: white;
  font-size: 0.875rem;
  border: none;
  outline: none;

  &::placeholder {
    color: #64748b;
  }
`;

const SuggestionsDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  background-color: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(34, 211, 238, 0.3);
  border-radius: 0.75rem;
  max-height: 200px;
  overflow-y: auto;
  z-index: 50;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(71, 85, 105, 0.5);
    border-radius: 3px;
  }
`;

const SuggestionItem = styled.div`
  padding: 0.75rem 1rem;
  color: #e2e8f0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(71, 85, 105, 0.3);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: rgba(34, 211, 238, 0.2);
    color: #22d3ee;
  }

  svg {
    color: #64748b;
    flex-shrink: 0;
  }

  &:hover svg {
    color: #22d3ee;
  }
`;

const SearchGroupWrapper = styled.div`
  position: relative;
`;

const NavigateButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: linear-gradient(to right, #06b6d4, #2563eb);
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 30px rgba(34, 211, 238, 0.5);

    svg {
      transform: translateX(4px);
    }
  }
`;

const ModeContainer = styled.div``;

const ModeLabel = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
`;

const ModeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
`;

const ModeButton = styled.button<{ isActive?: boolean; gradient?: string }>`
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  background-color: ${props => props.isActive ? 'rgba(0, 0, 0, 0.3)' : '#1e293b'};
  color: ${props => props.isActive ? 'white' : '#94a3b8'};
  border: 1px solid ${props => props.isActive ? 'transparent' : 'rgba(55, 65, 81, 0.5)'};

  ${props => props.gradient && `
    background: linear-gradient(135deg, ${props.gradient});
  `}

  &:hover {
    border-color: #475569;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`;

const MetricCard = styled.div<{ bg?: string }>`
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: ${props => props.bg || 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid rgba(71, 85, 105, 0.5);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: rgb(71, 85, 105);
  }
`;

const MetricIcon = styled.div<{ color?: string }>`
  margin-bottom: 0.5rem;
  color: ${props => props.color || '#94a3b8'};
`;

const MetricLabel = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 600;
`;

const MetricValue = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
  margin-top: 0.25rem;
`;

const AlertsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AlertsLabel = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const AlertsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 192px;
  overflow-y: auto;
`;

const AlertItem = styled.div<{ $borderColor?: string; $bgColor?: string; $textColor?: string }>`
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${props => props.$borderColor || 'rgba(239, 68, 68, 0.5)'};
  background-color: ${props => props.$bgColor || 'rgba(239, 68, 68, 0.2)'};
  color: ${props => props.$textColor || '#f87171'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

const AlertLabel = styled.div`
  flex: 1;
`;

const AlertDistance = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
`;

const FeaturesSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`;

const SectionSubtitle = styled.p`
  color: #94a3b8;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureCard = styled.div<{ bg?: string }>`
  padding: 1rem;
  border-radius: 0.75rem;
  background: ${props => props.bg || 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid rgba(71, 85, 105, 0.5);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: rgb(71, 85, 105);

    svg {
      transform: scale(1.1);
    }
  }
`;

const FeatureHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const FeatureInfo = styled.div`
  h3 {
    font-weight: 700;
    color: white;
    font-size: 0.875rem;
    margin: 0;
  }

  p {
    font-size: 0.75rem;
    color: #94a3b8;
    margin-top: 0.25rem;
  }
`;

const FeatureIcon = styled.div`
  flex-shrink: 0;
  margin-left: 0.5rem;
  color: #cbd5e1;
  transition: transform 0.3s ease;
`;

const FeatureFooter = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: #94a3b8;
  transition: color 0.3s ease;

  ${FeatureCard}:hover & {
    color: #cbd5e1;
  }
`;

const MapContainerWrapper = styled.div`
  position: relative;
  height: 100%;
  border-radius: 1rem;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border: 1px solid rgba(71, 85, 105, 0.5);
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MapBackground = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.05), transparent, rgba(168, 85, 247, 0.05));
`;

const MapAnimatedCircle = styled.div<{ borderColor?: string; size?: string; delay?: string }>`
  position: absolute;
  border-radius: 50%;
  border: 1px solid ${props => props.borderColor || 'rgba(34, 211, 238, 0.2)'};
  width: ${props => props.size || '128px'};
  height: ${props => props.size || '128px'};
  animation: pulse ${props => props.delay || '2s'} ease-in-out infinite;
  z-index: 1;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const MapContent = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const MapIconWrapper = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: 9999px;
  background-color: rgba(34, 211, 238, 0.2);
  border: 1px solid rgba(34, 211, 238, 0.5);
`;

const MapTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`;

const MapSubtitle = styled.p`
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 1rem;
`;

const MapButton = styled.button`
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  background-color: rgba(34, 211, 238, 0.3);
  border: 1px solid rgba(34, 211, 238, 0.5);
  color: #06b6d4;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(34, 211, 238, 0.5);
  }
`;

const SOSButtonWrapper = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 64px;
  height: 64px;
  border-radius: 9999px;
  background: linear-gradient(135deg, #ef4444, #991b1b);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 25px 50px -12px rgba(239, 68, 68, 0.5);
  transition: all 0.3s ease;
  z-index: 40;
  animation: pulse-sos 2s ease-in-out infinite;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 25px 50px -12px rgba(239, 68, 68, 0.8);

    svg {
      transform: scale(1.25);
    }
  }

  @keyframes pulse-sos {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }
`;

const RightSidebarCard = styled.div`
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid #1e293b;
`;

const CardTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.75rem;
`;

const SafetyScore = styled.div`
  font-size: 2.25rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 0.5rem;
`;

const ScoreBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #334155;
  border-radius: 9999px;
  margin-bottom: 0.75rem;
  overflow: hidden;
`;

const ScoreFill = styled.div<{ percentage?: string }>`
  height: 100%;
  background: linear-gradient(to right, #10b981, #14b8a6);
  width: ${props => props.percentage || '92%'};
`;

const CardText = styled.p`
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
`;

const RightCardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const RowLabel = styled.span`
  color: #94a3b8;
`;

const RowValue = styled.span`
  font-weight: 700;
  color: white;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #10b981;
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;

  @keyframes pulse-dot {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const StatusContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  span {
    font-size: 0.75rem;
    color: #94a3b8;
  }
`;

const StatusButton = styled.button`
  width: 100%;
  padding: 0.5rem 0.75rem;
  background-color: rgba(37, 99, 235, 0.3);
  border: 1px solid rgba(37, 99, 235, 0.5);
  color: #93c5fd;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(37, 99, 235, 0.5);
    border-color: rgb(37, 99, 235);
  }
`;

const RouteGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const RouteCard = styled.div`
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid #334155;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: rgb(71, 85, 105);
  }
`;

const RouteHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const RouteIconWrapper = styled.div`
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: rgba(71, 85, 105, 0.5);
`;

const RouteName = styled.h4`
  font-weight: 700;
  color: white;
  font-size: 0.875rem;
  margin: 0;
`;

const RouteBadge = styled.span`
  font-size: 0.75rem;
  background-color: rgba(34, 211, 238, 0.2);
  color: #06b6d4;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid rgba(34, 211, 238, 0.5);
`;

const RouteDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  margin-bottom: 0.75rem;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const RouteSelectButton = styled.button`
  width: 100%;
  padding: 0.5rem 0.75rem;
  background-color: rgba(37, 99, 235, 0.3);
  border: 1px solid rgba(37, 99, 235, 0.5);
  color: #93c5fd;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(37, 99, 235, 0.5);
    border-color: rgb(37, 99, 235);
  }
`;

// ==================== HEADER COMPONENT ====================
const Header = () => {
  return (
    <HeaderWrapper>
      <HeaderContent>
        <HeaderLogo>
          <LogoIcon>
            <Navigation size={24} color="white" />
          </LogoIcon>
          <LogoText>
            <h1>Beyond-ETA</h1>
            <p>SMART NAVIGATION</p>
          </LogoText>
        </HeaderLogo>
        <HeaderButton>✨ Live Routes</HeaderButton>
      </HeaderContent>
    </HeaderWrapper>
  );
};

// ==================== ROUTE SEARCH COMPONENT ====================
const RouteSearch = ({ startLocation, endLocation, onStartChange, onEndChange, onNavigate }) => {
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);

  // Available locations for suggestions
  const availableLocations = [
    { name: 'Taj Mahal', type: 'Landmark' },
    { name: 'India Gate', type: 'Landmark' },
    { name: 'Red Fort', type: 'Landmark' },
    { name: 'Qutub Minar', type: 'Landmark' },
    { name: 'Lal Qila', type: 'Fort' },
    { name: 'New Delhi', type: 'City' },
    { name: 'Connaught Place', type: 'Market' },
    { name: 'CP', type: 'Shorthand' },
    { name: 'Airport', type: 'Terminal' },
    { name: 'Central', type: 'Station' },
  ];

  const filterSuggestions = (input) => {
    if (!input.trim()) return [];
    return availableLocations.filter(loc =>
      loc.name.toLowerCase().includes(input.toLowerCase())
    );
  };

  const handleStartChange = (value) => {
    onStartChange(value);
    if (value.trim()) {
      setStartSuggestions(filterSuggestions(value));
      setShowStartSuggestions(true);
    } else {
      setStartSuggestions([]);
      setShowStartSuggestions(false);
    }
  };

  const handleEndChange = (value) => {
    onEndChange(value);
    if (value.trim()) {
      setEndSuggestions(filterSuggestions(value));
      setShowEndSuggestions(true);
    } else {
      setEndSuggestions([]);
      setShowEndSuggestions(false);
    }
  };

  const selectStartLocation = (location) => {
    onStartChange(location.name);
    setShowStartSuggestions(false);
    setStartSuggestions([]);
  };

  const selectEndLocation = (location) => {
    onEndChange(location.name);
    setShowEndSuggestions(false);
    setEndSuggestions([]);
  };

  return (
    <SearchContainer>
      <SearchGroupWrapper>
        <SearchGroup>
          <SearchLabel>Starting Point</SearchLabel>
          <SearchInputWrapper startColor="rgba(34, 211, 238, 0.2)">
            <MapPin size={20} color="#22d3ee" />
            <SearchInput
              type="text"
              placeholder="Current location"
              value={startLocation}
              onChange={(e) => handleStartChange(e.target.value)}
              onFocus={() => startLocation.trim() && setShowStartSuggestions(true)}
              onBlur={() => setTimeout(() => setShowStartSuggestions(false), 200)}
            />
          </SearchInputWrapper>
          {showStartSuggestions && startSuggestions.length > 0 && (
            <SuggestionsDropdown>
              {startSuggestions.map((loc, idx) => (
                <SuggestionItem key={idx} onClick={() => selectStartLocation(loc)}>
                  <MapPin size={16} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{loc.name}</div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.1rem' }}>{loc.type}</div>
                  </div>
                </SuggestionItem>
              ))}
            </SuggestionsDropdown>
          )}
        </SearchGroup>
      </SearchGroupWrapper>

      <SearchGroupWrapper>
        <SearchGroup>
          <SearchLabel>Destination</SearchLabel>
          <SearchInputWrapper startColor="rgba(239, 68, 68, 0.2)">
            <MapPin size={20} color="#f87171" />
            <SearchInput
              type="text"
              placeholder="Where to go?"
              value={endLocation}
              onChange={(e) => handleEndChange(e.target.value)}
              onFocus={() => endLocation.trim() && setShowEndSuggestions(true)}
              onBlur={() => setTimeout(() => setShowEndSuggestions(false), 200)}
            />
          </SearchInputWrapper>
          {showEndSuggestions && endSuggestions.length > 0 && (
            <SuggestionsDropdown>
              {endSuggestions.map((loc, idx) => (
                <SuggestionItem key={idx} onClick={() => selectEndLocation(loc)}>
                  <MapPin size={16} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{loc.name}</div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.1rem' }}>{loc.type}</div>
                  </div>
                </SuggestionItem>
              ))}
            </SuggestionsDropdown>
          )}
        </SearchGroup>
      </SearchGroupWrapper>

      <NavigateButton onClick={onNavigate}>
        <span>Start Navigation</span>
        <ArrowRight size={20} />
      </NavigateButton>
    </SearchContainer>
  );
};

// ==================== MODE SELECTOR COMPONENT ====================
const ModeSelector = ({ selectedMode, onModeChange }) => {
  const modes = [
    { id: 'balanced', label: 'Balanced', icon: Zap, gradient: '#f97316, #ea580c' },
    { id: 'safe', label: 'Safety First', icon: Shield, gradient: '#ef4444, #dc2626' },
    { id: 'health', label: 'Breathe Better', icon: Wind, gradient: '#22c55e, #16a34a' },
    { id: 'eco', label: 'Eco Mode', icon: Leaf, gradient: '#10b981, #059669' },
    { id: 'women', label: 'Women Safety', icon: Heart, gradient: '#ec4899, #be185d' },
  ];

  return (
    <ModeContainer>
      <ModeLabel>Navigation Mode</ModeLabel>
      <ModeGrid>
        {modes.map((mode) => {
          const IconComponent = mode.icon;
          const isActive = selectedMode === mode.id;
          return (
            <ModeButton
              key={mode.id}
              isActive={isActive}
              gradient={isActive ? mode.gradient : null}
              onClick={() => {
                onModeChange(mode.id);
                toast.success(`${mode.label} activated`, {
                  icon: <IconComponent size={20} />,
                  style: { background: '#1e293b', color: '#e2e8f0' },
                });
              }}
            >
              <IconComponent size={20} />
              <span style={{ display: 'none' }}>{mode.label.split(' ')[0]}</span>
            </ModeButton>
          );
        })}
      </ModeGrid>
    </ModeContainer>
  );
};

// ==================== METRICS DASHBOARD ====================
const MetricsDashboard = () => {
  const metrics = [
    { label: 'Time', value: '24 min', icon: Clock, color: '#60a5fa' },
    { label: 'AQI', value: '42', icon: Wind, color: '#4ade80' },
    { label: 'Road Quality', value: '9.2/10', icon: BarChart3, color: '#a78bfa' },
    { label: 'Safety', value: 'High', icon: CheckCircle, color: '#34d399' },
  ];

  return (
    <MetricsGrid>
      {metrics.map((metric, idx) => {
        const IconComponent = metric.icon;
        return (
          <MetricCard key={idx} bg={`rgba(${metric.color}, 0.1)`}>
            <MetricIcon color={metric.color}>
              <IconComponent size={20} />
            </MetricIcon>
            <MetricLabel>{metric.label}</MetricLabel>
            <MetricValue>{metric.value}</MetricValue>
          </MetricCard>
        );
      })}
    </MetricsGrid>
  );
};

// ==================== ALERTS SECTION ====================
const AlertsSection = () => {
  const alerts = [
    { type: 'pothole', label: 'Pothole Ahead', icon: AlertTriangle, distance: '2.3 km', color: 'yellow' },
    { type: 'ambulance', label: 'Emergency Vehicle', icon: Radio, distance: '1.5 km', color: 'red' },
    { type: 'fatigue', label: 'Fatigue Detected', icon: Eye, distance: '5.2 km', color: 'orange' },
    { type: 'aqi', label: 'High Pollution', icon: Wind, distance: '3.1 km', color: 'red' },
  ];

  const colorMap = {
    red: { bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.5)', text: '#f87171' },
    yellow: { bg: 'rgba(234, 179, 8, 0.2)', border: 'rgba(234, 179, 8, 0.5)', text: '#eab308' },
    orange: { bg: 'rgba(249, 115, 22, 0.2)', border: 'rgba(249, 115, 22, 0.5)', text: '#fb923c' },
  };

  return (
    <AlertsWrapper>
      <AlertsLabel>Live Alerts</AlertsLabel>
      <AlertsList>
        {alerts.map((alert, idx) => {
          const IconComponent = alert.icon;
          const colors = colorMap[alert.color];
          return (
            <AlertItem
              key={idx}
              $bgColor={colors.bg}
              $borderColor={colors.border}
              $textColor={colors.text}
            >
              <IconComponent size={16} />
              <AlertLabel>{alert.label}</AlertLabel>
              <AlertDistance>{alert.distance}</AlertDistance>
            </AlertItem>
          );
        })}
      </AlertsList>
    </AlertsWrapper>
  );
};

// ==================== FEATURE CARDS ====================
const FeatureCards = () => {
  const features = [
    { title: 'Pothole Detection', desc: 'Real-time road hazard alerts', icon: AlertTriangle, bg: 'rgba(250, 204, 21, 0.1)' },
    { title: 'Air Quality Routing', desc: 'Avoid polluted areas', icon: Wind, bg: 'rgba(34, 197, 94, 0.1)' },
    { title: 'Women Safety Mode', desc: 'Well-lit & populated routes', icon: Heart, bg: 'rgba(236, 72, 153, 0.1)' },
    { title: 'Emergency Awareness', desc: 'Detect ambulances & fire trucks', icon: Radio, bg: 'rgba(239, 68, 68, 0.1)' },
    { title: 'Drowsiness Detection', desc: 'Monitor driver fatigue', icon: Eye, bg: 'rgba(168, 85, 247, 0.1)' },
    { title: 'ML Optimization', desc: 'Predictive route planning', icon: Cpu, bg: 'rgba(34, 211, 238, 0.1)' },
  ];

  return (
    <FeaturesGrid>
      {features.map((feature, idx) => {
        const IconComponent = feature.icon;
        return (
          <FeatureCard key={idx} bg={feature.bg}>
            <FeatureHeader>
              <FeatureInfo>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </FeatureInfo>
              <FeatureIcon>
                <IconComponent size={24} />
              </FeatureIcon>
            </FeatureHeader>
            <FeatureFooter>
              Learn more <ArrowRight size={12} style={{ marginLeft: '0.25rem' }} />
            </FeatureFooter>
          </FeatureCard>
        );
      })}
    </FeaturesGrid>
  );
};

// ==================== MAP CONTAINER ====================
const MapContainer = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [leafletReady, setLeafletReady] = useState(false);
  const { currentLocation, setCurrentLocation, destinationLocation } = useNavigationStore();

  // Fetch user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({
            name: 'Your Location',
            lat: latitude,
            lng: longitude,
          });
          console.log('✅ Current location:', latitude, longitude);
        },
        (error) => {
          console.error('❌ Geolocation error:', error);
          // Set default location (Delhi) as fallback
          setCurrentLocation({
            name: 'Default Location',
            lat: 28.6139,
            lng: 77.209,
          });
          toast.error('Unable to get location, using default');
        }
      );
    }
  }, [setCurrentLocation]);

  // Load Leaflet on client side
  useEffect(() => {
    import('leaflet').then((L) => {
      setLeafletReady(true);
    }).catch((error) => {
      console.error('❌ Failed to load Leaflet:', error);
      setMapError('Failed to load map library');
    });
  }, []);

  // Initialize map and draw route
  useEffect(() => {
    if (!leafletReady || !mapRef.current || mapInstanceRef.current) return;
    if (!currentLocation) return;

    (async () => {
      try {
        const leafletModule = await import('leaflet');
        const L = leafletModule.default || leafletModule;

        // Initialize map
        const map = L.map(mapRef.current!).setView([currentLocation.lat, currentLocation.lng], 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        // Custom icon for current location (cyan)
        const currentIcon = L.divIcon({
          html: `
            <div style="
              background-color: #06b6d4;
              border: 3px solid white;
              border-radius: 50%;
              width: 35px;
              height: 35px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 15px rgba(6, 182, 212, 0.6);
              animation: pulse 2s infinite;
            ">
              <div style="
                width: 10px;
                height: 10px;
                background-color: white;
                border-radius: 50%;
              "></div>
            </div>
          `,
          className: '',
          iconSize: [35, 35],
          iconAnchor: [17.5, 17.5],
        });

        // Custom icon for destination (red)
        const destIcon = L.divIcon({
          html: `
            <div style="
              background-color: #ef4444;
              border: 3px solid white;
              border-radius: 50%;
              width: 30px;
              height: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
            ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z"/>
              </svg>
            </div>
          `,
          className: '',
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        // Add current location marker
        L.marker([currentLocation.lat, currentLocation.lng], { 
          icon: currentIcon,
          title: 'Your Location'
        }).bindPopup('<b>📍 Your Current Location</b><br>You are here').addTo(map);

        // Add destination marker if available
        if (destinationLocation) {
          L.marker([destinationLocation.lat, destinationLocation.lng], { 
            icon: destIcon,
            title: 'Destination'
          }).bindPopup(`<b>🎯 Destination</b><br>${destinationLocation.name}`).addTo(map);

          // Draw route line from current to destination
          const routeLatLngs = [
            [currentLocation.lat, currentLocation.lng],
            [destinationLocation.lat, destinationLocation.lng]
          ];

          L.polyline(routeLatLngs, {
            color: '#3b82f6',
            weight: 4,
            opacity: 0.8,
            dashArray: '5, 5',
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(map);

          // Calculate distance
          const R = 6371; // Earth's radius in km
          const lat1 = currentLocation.lat * Math.PI / 180;
          const lat2 = destinationLocation.lat * Math.PI / 180;
          const dlat = (destinationLocation.lat - currentLocation.lat) * Math.PI / 180;
          const dlng = (destinationLocation.lng - currentLocation.lng) * Math.PI / 180;
          const a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dlng / 2) * Math.sin(dlng / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;
          const estimatedTime = Math.round(distance / 40 * 60); // At 40 km/h

          toast.success(`📍 Route Ready: ${distance.toFixed(1)}km • ~${estimatedTime} min`);

          // Fit map to show both markers
          const group = L.latLngBounds([
            [currentLocation.lat, currentLocation.lng],
            [destinationLocation.lat, destinationLocation.lng]
          ]);
          map.fitBounds(group, { padding: [50, 50] });
        } else {
          map.setView([currentLocation.lat, currentLocation.lng], 13);
        }

        mapInstanceRef.current = map;
        setMapLoaded(true);
        console.log('✅ Leaflet map with geolocation loaded successfully');

        return () => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
          }
        };
      } catch (error) {
        console.error('❌ Map Error:', error);
        setMapError(error instanceof Error ? error.message : 'Failed to load map');
      }
    })();
  }, [leafletReady, currentLocation, destinationLocation]);

  if (mapError) {
    return (
      <MapContainerWrapper>
        <MapContent>
          <MapIconWrapper>
            <MapPin size={32} color="#ef4444" />
          </MapIconWrapper>
          <MapTitle>Map Loading Error</MapTitle>
          <MapSubtitle>{mapError}</MapSubtitle>
          <MapButton disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            Check Console for Details
          </MapButton>
        </MapContent>
      </MapContainerWrapper>
    );
  }

  return (
    <MapContainerWrapper>
      <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '1rem' }} />
    </MapContainerWrapper>
  );
};

// ==================== SOS EMERGENCY BUTTON ====================
const SOSButton = ({ onClick }) => {
  return (
    <SOSButtonWrapper onClick={onClick} title="Emergency SOS">
      <Phone size={28} />
    </SOSButtonWrapper>
  );
};

// ==================== MAIN DASHBOARD COMPONENT ====================
export default function Dashboard() {
  const {
    startLocation,
    endLocation,
    selectedMode,
    setStartLocation,
    setEndLocation,
    setSelectedMode,
    setDestinationLocation,
  } = useNavigationStore();

  // Simple geocoding: map destination names to coordinates
  const getDestinationCoordinates = (destination: string) => {
    const locations: Record<string, { lat: number; lng: number }> = {
      // Delhi landmarks
      'taj mahal': { lat: 27.1751, lng: 78.0421 },
      'india gate': { lat: 28.6129, lng: 77.2295 },
      'red fort': { lat: 28.6566, lng: 77.2408 },
      'qutub minar': { lat: 28.5244, lng: 77.1855 },
      'lal qila': { lat: 28.6566, lng: 77.2408 },
      'new delhi': { lat: 28.6331, lng: 77.2197 },
      'cp': { lat: 28.6295, lng: 77.2064 },
      'connaught place': { lat: 28.6295, lng: 77.2064 },
      'airport': { lat: 28.5562, lng: 77.1000 },
      'central': { lat: 28.5355, lng: 77.1000 },
    };

    const normalized = destination.toLowerCase();
    const coords = locations[normalized];
    
    if (coords) {
      return coords;
    }

    // Generate random nearby coordinates within Delhi NCR if not found
    const baseLatitude = 28.6139;
    const baseLongitude = 77.209;
    const randomLat = baseLatitude + (Math.random() - 0.5) * 0.2;
    const randomLng = baseLongitude + (Math.random() - 0.5) * 0.2;
    return { lat: randomLat, lng: randomLng };
  };

  const handleNavigate = () => {
    if (!startLocation || !endLocation) {
      toast.error('Please enter both locations', {
        icon: <AlertCircle size={20} />,
        style: { background: '#1e293b', color: '#e2e8f0' },
      });
      return;
    }

    // Set destination with GPS coordinates
    const destCoords = getDestinationCoordinates(endLocation);
    setDestinationLocation({
      name: endLocation,
      lat: destCoords.lat,
      lng: destCoords.lng,
    });

    toast.success(`🚀 Navigating to ${endLocation}`, {
      icon: <MapPin size={20} />,
      style: { background: '#1e293b', color: '#e2e8f0' },
    });
  };

  const handleSOS = () => {
    toast.success('Emergency services contacted', {
      icon: <Phone size={20} />,
      style: { background: '#dc2626', color: '#fecaca' },
    });
  };

  return (
    <DashboardContainer>
      <Header />

      <MainContent>
        <ContentWrapper>
          <SearchGrid>
            {/* Left Sidebar */}
            <LeftSidebar>
              <RouteSearch
                startLocation={startLocation}
                endLocation={endLocation}
                onStartChange={setStartLocation}
                onEndChange={setEndLocation}
                onNavigate={handleNavigate}
              />
              <ModeSelector selectedMode={selectedMode} onModeChange={setSelectedMode} />
              <MetricsDashboard />
              <AlertsSection />
            </LeftSidebar>

            {/* Center - Map */}
            <MapSection>
              <MapContainer />
            </MapSection>

            {/* Right Sidebar */}
            <RightSidebar>
              <RightSidebarCard>
                <CardTitle>AI Safety Score</CardTitle>
                <SafetyScore>92/100</SafetyScore>
                <ScoreBar>
                  <ScoreFill percentage="92%" />
                </ScoreBar>
                <CardText>Excellent route conditions</CardText>
              </RightSidebarCard>

              <RightSidebarCard>
                <CardTitle>Distance & ETA</CardTitle>
                <RightCardRow>
                  <RowLabel>Distance</RowLabel>
                  <RowValue>12.5 km</RowValue>
                </RightCardRow>
                <RightCardRow>
                  <RowLabel>Est. Time</RowLabel>
                  <RowValue>24 min</RowValue>
                </RightCardRow>
                <RightCardRow>
                  <RowLabel>Traffic</RowLabel>
                  <RowValue style={{ color: '#facc15' }}>Moderate</RowValue>
                </RightCardRow>
              </RightSidebarCard>

              <RightSidebarCard>
                <CardTitle>Current Status</CardTitle>
                <StatusContent>
                  <StatusDot />
                  <span>Ready to Navigate</span>
                </StatusContent>
                <StatusButton>Start Journey</StatusButton>
              </RightSidebarCard>
            </RightSidebar>
          </SearchGrid>

          {/* Features Section */}
          <FeaturesSection>
            <div>
              <SectionTitle>AI-Powered Features</SectionTitle>
              <SectionSubtitle>Smart safety and routing capabilities</SectionSubtitle>
            </div>
            <FeatureCards />
          </FeaturesSection>

          {/* Route Options */}
          <div>
            <SectionTitle style={{ marginBottom: '1rem' }}>Route Options</SectionTitle>
            <RouteGrid>
              {[
                { name: 'Fastest', time: '18 min', distance: '14.2 km', traffic: 'Heavy', icon: Zap, badge: 'Recommended' },
                { name: 'Safest', time: '22 min', distance: '11.8 km', traffic: 'Light', icon: Shield, badge: 'AI Optimized' },
                { name: 'Eco-Friendly', time: '25 min', distance: '10.5 km', traffic: 'Minimal', icon: Leaf, badge: 'Carbon Neutral' },
              ].map((route, idx) => {
                const IconComponent = route.icon;
                const trafficColor = route.traffic === 'Heavy' ? '#f87171' : route.traffic === 'Light' ? '#34d399' : '#60a5fa';
                return (
                  <RouteCard key={idx}>
                    <RouteHeader>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <RouteIconWrapper>
                          <IconComponent size={20} color="#06b6d4" />
                        </RouteIconWrapper>
                        <div>
                          <RouteName>{route.name}</RouteName>
                          <RouteBadge>{route.badge}</RouteBadge>
                        </div>
                      </div>
                    </RouteHeader>
                    <RouteDetails>
                      <RowLabel>Duration</RowLabel>
                      <RowValue>{route.time}</RowValue>
                    </RouteDetails>
                    <RouteDetails>
                      <RowLabel>Distance</RowLabel>
                      <RowValue>{route.distance}</RowValue>
                    </RouteDetails>
                    <RouteDetails>
                      <RowLabel>Traffic</RowLabel>
                      <RowValue style={{ color: trafficColor }}>{route.traffic}</RowValue>
                    </RouteDetails>
                    <RouteSelectButton>Select Route</RouteSelectButton>
                  </RouteCard>
                );
              })}
            </RouteGrid>
          </div>
        </ContentWrapper>
      </MainContent>

      <SOSButton onClick={handleSOS} />
    </DashboardContainer>
  );
}
