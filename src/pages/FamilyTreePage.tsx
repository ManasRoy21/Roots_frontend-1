import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getFamilyMembers, 
  getRelationships, 
  addFamilyMember,
  selectFamilyMembers,
  selectRelationships,
  selectFamilyLoading,
  selectFamilyError
} from '../redux/slices/familySlice';
import { selectProfile } from '../redux/slices/userSlice';
import { 
  setSelectedMember,
  performSearch,
  selectSearchQuery,
  selectSearchResults,
  selectSelectedMemberId,
  selectShowTooltip,
  dismissTooltip,
  checkFirstTimeVisit
} from '../redux/slices/treeSlice';
import NavigationBar from '../components/NavigationBar';
import TreeCanvas from '../components/TreeCanvas';
import ZoomControls from '../components/ZoomControls';
import SearchInput from '../components/SearchInput';
import TreeOwnerProfile from '../components/TreeOwnerProfile';
import MemberDetailPanel from '../components/MemberDetailPanel';
import FirstTimeTooltip from '../components/FirstTimeTooltip';
import AddRelativeModal from '../components/AddRelativeModal';
import { useAppDispatch, useAppSelector } from '../redux/store';
import './FamilyTreePage.scss';

function FamilyTreePageContent(): React.ReactElement {
  const dispatch = useAppDispatch();
  const familyMembers = useAppSelector(selectFamilyMembers);
  const relationships = useAppSelector(selectRelationships);
  const isLoading = useAppSelector(selectFamilyLoading);
  const error = useAppSelector(selectFamilyError);
  const user = useAppSelector(selectProfile);
  const searchQuery = useAppSelector(selectSearchQuery);
  const searchResults = useAppSelector(selectSearchResults);
  const selectedMemberId = useAppSelector(selectSelectedMemberId);
  const showFirstTimeTooltip = useAppSelector(selectShowTooltip);
  
  const [initialLoadComplete, setInitialLoadComplete] = useState<boolean>(false);
  const [showAddRelativeModal, setShowAddRelativeModal] = useState<boolean>(false);
  const [addRelativeType, setAddRelativeType] = useState<string | null>(null);
  const [addRelativeRelatedTo, setAddRelativeRelatedTo] = useState<string | null>(null);
  const navigate = useNavigate();
  const rootCardRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const treeContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load family data on mount and when returning to the page
    const loadData = async () => {
      try {
        await dispatch(getFamilyMembers()).unwrap();
        await dispatch(getRelationships()).unwrap();
      } catch (err) {
        console.error('Failed to load family tree data:', err);
      } finally {
        setInitialLoadComplete(true);
      }
    };

    loadData();
    
    // Also refresh when the page becomes visible (user returns from another tab/page)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch]);

  // Check for first-time visit after data loads
  useEffect(() => {
    if (initialLoadComplete) {
      // Check if this is first visit (no family members added yet, only tree owner)
      const hasAddedMembers = familyMembers.length > 1 || relationships.length > 0;
      
      if (!hasAddedMembers) {
        dispatch(checkFirstTimeVisit());
      }
    }
  }, [initialLoadComplete, familyMembers, relationships, dispatch]);

  // Dismiss tooltip when first member is added
  useEffect(() => {
    if (showFirstTimeTooltip && (familyMembers.length > 1 || relationships.length > 0)) {
      dispatch(dismissTooltip());
    }
  }, [familyMembers.length, relationships.length, showFirstTimeTooltip, dispatch]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape key closes detail panel
      if (e.key === 'Escape' && selectedMemberId) {
        e.preventDefault();
        dispatch(setSelectedMember(null));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMemberId, dispatch]);

  const openAddRelativeModal = (type: string | null, relatedTo: string | null) => {
    setAddRelativeType(type);
    setAddRelativeRelatedTo(relatedTo);
    setShowAddRelativeModal(true);
  };

  const handlePlaceholderClick = (type: string, relatedTo: string) => {
    openAddRelativeModal(type, relatedTo);
  };

  const handleAddParents = () => {
    openAddRelativeModal('parent', user?.id);
  };

  const handleAddSpouse = () => {
    openAddRelativeModal('spouse', user?.id);
  };

  const handleAddChildren = () => {
    openAddRelativeModal('child', user?.id);
  };

  const handleCloseAddRelativeModal = () => {
    setShowAddRelativeModal(false);
    setAddRelativeType(null);
    setAddRelativeRelatedTo(null);
  };

  const handleAddRelativeSubmit = async (formData: any) => {
    try {
      await dispatch(addFamilyMember({
        ...formData,
        relatedTo: addRelativeRelatedTo,
        relationshipType: addRelativeType,
      })).unwrap();
      handleCloseAddRelativeModal();
      // Refresh the family data
      await dispatch(getFamilyMembers({ forceRefresh: true })).unwrap();
      await dispatch(getRelationships({ forceRefresh: true })).unwrap();
    } catch (err) {
      console.error('Failed to add family member:', err);
    }
  };

  const handleProfileClick = () => {
    // Navigate to member profile page (to be implemented)
    console.log('Profile clicked for member:', selectedMemberId);
  };

  const handleEditClick = () => {
    // Navigate to edit member page (to be implemented)
    navigate(`/edit-family-member/${selectedMemberId}`);
  };

  const handleAddRelativeClick = () => {
    // Open modal to add relative to selected member
    openAddRelativeModal(null, selectedMemberId);
  };

  const handleRelatedMemberClick = (memberId: string) => {
    // Select the related member
    dispatch(setSelectedMember(memberId));
  };

  const handleTracePath = (startId: string, targetId: string) => {
    // Path calculation is now handled in RelationshipExplorer component
    // This callback can be used for analytics or additional actions
    console.log('Tracing path from', startId, 'to', targetId);
  };

  // Check if user has a spouse
  const hasSpouse = relationships.some(
    rel => 
      (rel.fromUserId === user?.id && rel.relationshipType === 'spouse') ||
      (rel.toUserId === user?.id && rel.relationshipType === 'spouse')
  );

  // Find the tree owner (current user) as a family member
  const treeOwner = familyMembers.find(member => member.userId === user?.id) || {
    id: user?.id || 'unknown',
    userId: user?.id || 'unknown',
    firstName: user?.firstName || 'User',
    lastName: user?.lastName || '',
    dateOfBirth: user?.dateOfBirth || null,
    photoUrl: user?.photoUrl || null,
  };

  // Ensure tree owner is always in the members list for the canvas
  const membersWithOwner = familyMembers.some(m => m.id === treeOwner.id || m.userId === user?.id)
    ? familyMembers
    : [treeOwner, ...familyMembers];

  if (!initialLoadComplete) {
    return (
      <div className="family-tree-page">
        <NavigationBar />
        <div className="loading-container" role="status" aria-live="polite">
          <p>Loading your family tree...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="family-tree-page">
        <NavigationBar />
        <div className="error-container" role="alert" aria-live="assertive">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} aria-label="Retry loading family tree">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleSearchChange = (query: string) => {
    dispatch(performSearch({ query, members: familyMembers }));
  };

  const handleMemberClick = (memberId: string) => {
    dispatch(setSelectedMember(memberId));
  };

  return (
    <div className="family-tree-page">
      <NavigationBar />
      <div className="tree-controls-bar">
        <SearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search tree..."
          debounceMs={300}
          resultsCount={searchQuery ? searchResults.length : null}
        />
        <ZoomControls />
      </div>
      <div className="tree-main-content">
        <aside className="tree-sidebar" ref={sidebarRef}>
          {!selectedMemberId ? (
            <TreeOwnerProfile
              treeOwner={treeOwner}
              onAddParents={handleAddParents}
              onAddSpouse={handleAddSpouse}
              onAddChildren={handleAddChildren}
              hasSpouse={hasSpouse}
            />
          ) : (
            <MemberDetailPanel
              selectedMember={familyMembers.find(m => m.id === selectedMemberId)}
              allMembers={familyMembers}
              relationships={relationships}
              treeOwner={treeOwner}
              onProfileClick={handleProfileClick}
              onEditClick={handleEditClick}
              onAddRelativeClick={handleAddRelativeClick}
              onRelatedMemberClick={handleRelatedMemberClick}
              onTracePath={handleTracePath}
            />
          )}
        </aside>
        <div className="tree-content" ref={treeContentRef}>
          <TreeCanvas
            members={membersWithOwner}
            relationships={relationships}
            rootMemberId={treeOwner.id}
            onMemberClick={handleMemberClick}
            onPlaceholderClick={handlePlaceholderClick}
            rootCardRef={rootCardRef}
          />
          <FirstTimeTooltip
            show={showFirstTimeTooltip}
            onDismiss={() => dispatch(dismissTooltip())}
            targetRef={rootCardRef}
          />
        </div>
      </div>
      
      {showAddRelativeModal && (
        <AddRelativeModal
          isOpen={showAddRelativeModal}
          onClose={handleCloseAddRelativeModal}
          onSubmit={handleAddRelativeSubmit}
          relationshipType={addRelativeType}
          relatedToMember={familyMembers.find(m => m.id === addRelativeRelatedTo) || treeOwner}
        />
      )}
    </div>
  );
}

function FamilyTreePage(): React.ReactElement {
  return <FamilyTreePageContent />;
}

export default FamilyTreePage;
