import { describe, it, expect, vi, beforeEach } from 'vitest';
import memoryReducer, {
  uploadPhotos,
  createMemory,
  getAlbums,
  setUploadProgress,
  clearError,
  selectMemories,
  selectAlbums,
  selectMemoryLoading,
  selectUploadProgress,
  selectMemoryError,
} from './memorySlice';
import { MemoryState } from '../../types/redux';
import { Memory, Album } from '../../types/api';

// Mock MemoryService
vi.mock('../../services/MemoryService', () => ({
  default: {
    uploadPhotos: vi.fn(),
    createMemory: vi.fn(),
    getAlbums: vi.fn(),
  },
}));

describe('memorySlice', () => {
  const initialState: MemoryState = {
    memories: [],
    albums: [],
    isLoading: false,
    uploadProgress: 0,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(memoryReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('sync reducers', () => {
    describe('setUploadProgress', () => {
      it('should set upload progress', () => {
        const action = setUploadProgress(50);
        const state = memoryReducer(initialState, action);
        expect(state.uploadProgress).toBe(50);
      });

      it('should update upload progress from existing value', () => {
        const stateWithProgress = { ...initialState, uploadProgress: 25 };
        const action = setUploadProgress(75);
        const state = memoryReducer(stateWithProgress, action);
        expect(state.uploadProgress).toBe(75);
      });

      it('should handle progress value of 0', () => {
        const stateWithProgress = { ...initialState, uploadProgress: 50 };
        const action = setUploadProgress(0);
        const state = memoryReducer(stateWithProgress, action);
        expect(state.uploadProgress).toBe(0);
      });

      it('should handle progress value of 100', () => {
        const action = setUploadProgress(100);
        const state = memoryReducer(initialState, action);
        expect(state.uploadProgress).toBe(100);
      });
    });

    describe('clearError', () => {
      it('should clear error state', () => {
        const stateWithError = {
          ...initialState,
          error: 'Some error message',
        };
        const actual = memoryReducer(stateWithError, clearError());
        expect(actual.error).toBeNull();
      });

      it('should not affect other state properties', () => {
        const stateWithData = {
          memories: [{ id: '1', description: 'Test memory' }],
          albums: [{ id: '1', name: 'Test album' }],
          isLoading: true,
          uploadProgress: 50,
          error: 'Some error',
        };
        const actual = memoryReducer(stateWithData, clearError());
        expect(actual.memories).toEqual(stateWithData.memories);
        expect(actual.albums).toEqual(stateWithData.albums);
        expect(actual.isLoading).toBe(true);
        expect(actual.uploadProgress).toBe(50);
        expect(actual.error).toBeNull();
      });
    });
  });

  describe('uploadPhotos async thunk', () => {
    const mockMemory: Memory = {
      id: 'memory-1',
      uploadedBy: 'user-1',
      albumId: 'album-1',
      location: 'Test Location',
      dateTaken: '2024-01-01',
      description: 'Test memory',
      photoUrls: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
      taggedPeople: ['person-1', 'person-2'],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    it('should handle uploadPhotos.pending', () => {
      const action = { type: uploadPhotos.pending.type };
      const state = memoryReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.uploadProgress).toBe(0);
    });

    it('should handle uploadPhotos.fulfilled', () => {
      const action = {
        type: uploadPhotos.fulfilled.type,
        payload: mockMemory,
      };
      const state = memoryReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.memories).toContain(mockMemory);
      expect(state.error).toBeNull();
    });

    it('should handle uploadPhotos.rejected', () => {
      const errorMessage = 'Failed to upload photos';
      const action = {
        type: uploadPhotos.rejected.type,
        payload: errorMessage,
      };
      const state = memoryReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.uploadProgress).toBe(0);
    });

    it('should set loading to true and clear error on pending', () => {
      const stateWithError = { ...initialState, error: 'Previous error', uploadProgress: 50 };
      const action = { type: uploadPhotos.pending.type };
      const state = memoryReducer(stateWithError, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.uploadProgress).toBe(0);
    });

    it('should add memory to existing memories array', () => {
      const existingMemory = {
        id: 'memory-0',
        description: 'Existing memory',
        photoUrls: ['https://example.com/existing.jpg'],
      };
      const stateWithMemories = {
        ...initialState,
        memories: [existingMemory],
      };
      const action = {
        type: uploadPhotos.fulfilled.type,
        payload: mockMemory,
      };
      const state = memoryReducer(stateWithMemories, action);
      expect(state.memories).toHaveLength(2);
      expect(state.memories).toContain(existingMemory);
      expect(state.memories).toContain(mockMemory);
    });

    it('should reset upload progress to 0 on rejection', () => {
      const stateWithProgress = { ...initialState, uploadProgress: 75 };
      const action = {
        type: uploadPhotos.rejected.type,
        payload: 'Upload failed',
      };
      const state = memoryReducer(stateWithProgress, action);
      expect(state.uploadProgress).toBe(0);
    });
  });

  describe('createMemory async thunk', () => {
    const mockMemory: Memory = {
      id: 'memory-2',
      uploadedBy: 'user-1',
      albumId: null,
      location: 'New Location',
      dateTaken: '2024-02-01',
      description: 'Created memory',
      photoUrls: ['https://example.com/created.jpg'],
      taggedPeople: [],
      createdAt: '2024-02-01T00:00:00.000Z',
      updatedAt: '2024-02-01T00:00:00.000Z',
    };

    it('should handle createMemory.pending', () => {
      const action = { type: createMemory.pending.type };
      const state = memoryReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle createMemory.fulfilled', () => {
      const action = {
        type: createMemory.fulfilled.type,
        payload: mockMemory,
      };
      const state = memoryReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.memories).toContain(mockMemory);
      expect(state.error).toBeNull();
    });

    it('should handle createMemory.rejected', () => {
      const errorMessage = 'Failed to create memory';
      const action = {
        type: createMemory.rejected.type,
        payload: errorMessage,
      };
      const state = memoryReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should set loading to true and clear error on pending', () => {
      const stateWithError = { ...initialState, error: 'Previous error' };
      const action = { type: createMemory.pending.type };
      const state = memoryReducer(stateWithError, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should add memory to existing memories array', () => {
      const existingMemory = {
        id: 'memory-1',
        description: 'Existing memory',
      };
      const stateWithMemories = {
        ...initialState,
        memories: [existingMemory],
      };
      const action = {
        type: createMemory.fulfilled.type,
        payload: mockMemory,
      };
      const state = memoryReducer(stateWithMemories, action);
      expect(state.memories).toHaveLength(2);
      expect(state.memories).toContain(existingMemory);
      expect(state.memories).toContain(mockMemory);
    });

    it('should not affect upload progress', () => {
      const stateWithProgress = { ...initialState, uploadProgress: 50 };
      const action = {
        type: createMemory.fulfilled.type,
        payload: mockMemory,
      };
      const state = memoryReducer(stateWithProgress, action);
      expect(state.uploadProgress).toBe(50);
    });
  });

  describe('getAlbums async thunk', () => {
    const mockAlbums: Album[] = [
      {
        id: 'album-1',
        name: 'Family Gatherings',
        description: 'Special family moments',
        coverPhotoUrl: 'https://example.com/cover1.jpg',
        createdBy: 'user-1',
        createdAt: '2024-01-01T00:00:00.000Z',
        photoCount: 5,
      },
      {
        id: 'album-2',
        name: 'Holidays',
        description: 'Holiday celebrations',
        coverPhotoUrl: null,
        createdBy: 'user-1',
        createdAt: '2024-01-02T00:00:00.000Z',
        photoCount: 0,
      },
    ];

    it('should handle getAlbums.pending', () => {
      const action = { type: getAlbums.pending.type };
      const state = memoryReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle getAlbums.fulfilled', () => {
      const action = {
        type: getAlbums.fulfilled.type,
        payload: mockAlbums,
      };
      const state = memoryReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.albums).toEqual(mockAlbums);
      expect(state.error).toBeNull();
    });

    it('should handle getAlbums.rejected', () => {
      const errorMessage = 'Failed to fetch albums';
      const action = {
        type: getAlbums.rejected.type,
        payload: errorMessage,
      };
      const state = memoryReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should set loading to true and clear error on pending', () => {
      const stateWithError = { ...initialState, error: 'Previous error' };
      const action = { type: getAlbums.pending.type };
      const state = memoryReducer(stateWithError, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should replace existing albums array', () => {
      const existingAlbums = [
        { id: 'old-album', name: 'Old Album' },
      ];
      const stateWithAlbums = {
        ...initialState,
        albums: existingAlbums,
      };
      const action = {
        type: getAlbums.fulfilled.type,
        payload: mockAlbums,
      };
      const state = memoryReducer(stateWithAlbums, action);
      expect(state.albums).toEqual(mockAlbums);
      expect(state.albums).not.toContain(existingAlbums[0]);
    });

    it('should handle empty albums array', () => {
      const action = {
        type: getAlbums.fulfilled.type,
        payload: [],
      };
      const state = memoryReducer(initialState, action);
      expect(state.albums).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should not affect memories or upload progress', () => {
      const stateWithData = {
        ...initialState,
        memories: [{ id: 'memory-1' }],
        uploadProgress: 75,
      };
      const action = {
        type: getAlbums.fulfilled.type,
        payload: mockAlbums,
      };
      const state = memoryReducer(stateWithData, action);
      expect(state.memories).toEqual(stateWithData.memories);
      expect(state.uploadProgress).toBe(75);
    });
  });

  describe('selectors', () => {
    const mockMemories: Memory[] = [
      {
        id: 'memory-1',
        description: 'First memory',
        photoUrls: ['https://example.com/photo1.jpg'],
      } as Memory,
      {
        id: 'memory-2',
        description: 'Second memory',
        photoUrls: ['https://example.com/photo2.jpg'],
      } as Memory,
    ];

    const mockAlbums: Album[] = [
      {
        id: 'album-1',
        name: 'Family Photos',
        photoCount: 10,
      } as Album,
      {
        id: 'album-2',
        name: 'Vacation',
        photoCount: 25,
      } as Album,
    ];

    const mockState = {
      memory: {
        memories: mockMemories,
        albums: mockAlbums,
        isLoading: false,
        uploadProgress: 85,
        error: 'Some error',
      } as MemoryState,
    };

    it('selectMemories should return memories from state', () => {
      expect(selectMemories(mockState)).toEqual(mockMemories);
    });

    it('selectMemories should return empty array when no memories', () => {
      const emptyState = { memory: { ...initialState } };
      expect(selectMemories(emptyState)).toEqual([]);
    });

    it('selectAlbums should return albums from state', () => {
      expect(selectAlbums(mockState)).toEqual(mockAlbums);
    });

    it('selectAlbums should return empty array when no albums', () => {
      const emptyState = { memory: { ...initialState } };
      expect(selectAlbums(emptyState)).toEqual([]);
    });

    it('selectMemoryLoading should return loading state', () => {
      expect(selectMemoryLoading(mockState)).toBe(false);
    });

    it('selectMemoryLoading should return true when loading', () => {
      const loadingState = {
        memory: { ...initialState, isLoading: true },
      };
      expect(selectMemoryLoading(loadingState)).toBe(true);
    });

    it('selectUploadProgress should return upload progress', () => {
      expect(selectUploadProgress(mockState)).toBe(85);
    });

    it('selectUploadProgress should return 0 when no progress', () => {
      const noProgressState = { memory: { ...initialState } };
      expect(selectUploadProgress(noProgressState)).toBe(0);
    });

    it('selectMemoryError should return error message', () => {
      expect(selectMemoryError(mockState)).toBe('Some error');
    });

    it('selectMemoryError should return null when no error', () => {
      const noErrorState = { memory: { ...initialState } };
      expect(selectMemoryError(noErrorState)).toBeNull();
    });
  });

  describe('state transitions', () => {
    it('should transition from initial to loading on uploadPhotos.pending', () => {
      const action = { type: uploadPhotos.pending.type };
      const state = memoryReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        uploadProgress: 0,
      });
    });

    it('should transition from loading to success on uploadPhotos.fulfilled', () => {
      const loadingState = { ...initialState, isLoading: true };
      const mockMemory = {
        id: 'memory-1',
        description: 'Test memory',
        photoUrls: ['https://example.com/photo.jpg'],
      };
      const action = {
        type: uploadPhotos.fulfilled.type,
        payload: mockMemory,
      };
      const state = memoryReducer(loadingState, action);
      expect(state).toEqual({
        memories: [mockMemory],
        albums: [],
        isLoading: false,
        uploadProgress: 0,
        error: null,
      });
    });

    it('should transition from loading to error on uploadPhotos.rejected', () => {
      const loadingState = { ...initialState, isLoading: true, uploadProgress: 50 };
      const errorMessage = 'Upload failed';
      const action = {
        type: uploadPhotos.rejected.type,
        payload: errorMessage,
      };
      const state = memoryReducer(loadingState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        uploadProgress: 0,
        error: errorMessage,
      });
    });

    it('should transition from initial to loading on createMemory.pending', () => {
      const action = { type: createMemory.pending.type };
      const state = memoryReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: true,
      });
    });

    it('should transition from loading to success on createMemory.fulfilled', () => {
      const loadingState = { ...initialState, isLoading: true };
      const mockMemory = {
        id: 'memory-1',
        description: 'Created memory',
      };
      const action = {
        type: createMemory.fulfilled.type,
        payload: mockMemory,
      };
      const state = memoryReducer(loadingState, action);
      expect(state).toEqual({
        memories: [mockMemory],
        albums: [],
        isLoading: false,
        uploadProgress: 0,
        error: null,
      });
    });

    it('should transition from initial to loading on getAlbums.pending', () => {
      const action = { type: getAlbums.pending.type };
      const state = memoryReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: true,
      });
    });

    it('should transition from loading to success on getAlbums.fulfilled', () => {
      const loadingState = { ...initialState, isLoading: true };
      const mockAlbums = [
        { id: 'album-1', name: 'Test Album' },
      ];
      const action = {
        type: getAlbums.fulfilled.type,
        payload: mockAlbums,
      };
      const state = memoryReducer(loadingState, action);
      expect(state).toEqual({
        memories: [],
        albums: mockAlbums,
        isLoading: false,
        uploadProgress: 0,
        error: null,
      });
    });

    it('should clear error when clearError is called', () => {
      const errorState = {
        ...initialState,
        error: 'Some error',
      };
      const state = memoryReducer(errorState, clearError());
      expect(state.error).toBeNull();
    });

    it('should handle multiple operations in sequence', () => {
      // Start with initial state
      let state = initialState;

      // Get albums
      state = memoryReducer(state, { type: getAlbums.pending.type });
      expect(state.isLoading).toBe(true);

      const albums = [{ id: 'album-1', name: 'Test Album' }];
      state = memoryReducer(state, {
        type: getAlbums.fulfilled.type,
        payload: albums,
      });
      expect(state.albums).toEqual(albums);
      expect(state.isLoading).toBe(false);

      // Upload photos
      state = memoryReducer(state, { type: uploadPhotos.pending.type });
      expect(state.isLoading).toBe(true);
      expect(state.uploadProgress).toBe(0);

      // Update progress
      state = memoryReducer(state, setUploadProgress(50));
      expect(state.uploadProgress).toBe(50);

      const memory = { id: 'memory-1', description: 'Test' };
      state = memoryReducer(state, {
        type: uploadPhotos.fulfilled.type,
        payload: memory,
      });
      expect(state.memories).toContain(memory);
      expect(state.albums).toEqual(albums);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should clear previous error when starting new operation', () => {
      const errorState = {
        ...initialState,
        error: 'Previous error',
      };
      const action = { type: uploadPhotos.pending.type };
      const state = memoryReducer(errorState, action);
      expect(state.error).toBeNull();
    });

    it('should preserve memories and albums when operation fails', () => {
      const existingMemories = [{ id: 'memory-1', description: 'Existing' }];
      const existingAlbums = [{ id: 'album-1', name: 'Existing Album' }];
      const stateWithData = {
        memories: existingMemories,
        albums: existingAlbums,
        isLoading: false,
        uploadProgress: 0,
        error: null,
      };
      const action = {
        type: uploadPhotos.rejected.type,
        payload: 'Upload failed',
      };
      const state = memoryReducer(stateWithData, action);
      expect(state.memories).toEqual(existingMemories);
      expect(state.albums).toEqual(existingAlbums);
      expect(state.error).toBe('Upload failed');
    });

    it('should handle error during album fetch without affecting memories', () => {
      const existingMemories = [{ id: 'memory-1', description: 'Existing' }];
      const stateWithMemories = {
        memories: existingMemories,
        albums: [],
        isLoading: false,
        uploadProgress: 25,
        error: null,
      };
      const action = {
        type: getAlbums.rejected.type,
        payload: 'Fetch failed',
      };
      const state = memoryReducer(stateWithMemories, action);
      expect(state.memories).toEqual(existingMemories);
      expect(state.uploadProgress).toBe(25);
      expect(state.error).toBe('Fetch failed');
    });

    it('should reset upload progress on upload failure', () => {
      const stateWithProgress = {
        ...initialState,
        uploadProgress: 75,
        isLoading: true,
      };
      const action = {
        type: uploadPhotos.rejected.type,
        payload: 'Upload failed',
      };
      const state = memoryReducer(stateWithProgress, action);
      expect(state.uploadProgress).toBe(0);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Upload failed');
    });

    it('should not reset upload progress on other operation failures', () => {
      const stateWithProgress = {
        ...initialState,
        uploadProgress: 75,
        isLoading: true,
      };
      const action = {
        type: createMemory.rejected.type,
        payload: 'Create failed',
      };
      const state = memoryReducer(stateWithProgress, action);
      expect(state.uploadProgress).toBe(75);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Create failed');
    });
  });

  describe('upload progress updates', () => {
    it('should handle progress updates during upload', () => {
      let state = initialState;

      // Start upload
      state = memoryReducer(state, { type: uploadPhotos.pending.type });
      expect(state.uploadProgress).toBe(0);

      // Progress updates
      state = memoryReducer(state, setUploadProgress(25));
      expect(state.uploadProgress).toBe(25);

      state = memoryReducer(state, setUploadProgress(50));
      expect(state.uploadProgress).toBe(50);

      state = memoryReducer(state, setUploadProgress(75));
      expect(state.uploadProgress).toBe(75);

      state = memoryReducer(state, setUploadProgress(100));
      expect(state.uploadProgress).toBe(100);

      // Complete upload
      const memory = { id: 'memory-1', description: 'Test' };
      state = memoryReducer(state, {
        type: uploadPhotos.fulfilled.type,
        payload: memory,
      });
      expect(state.memories).toContain(memory);
      expect(state.isLoading).toBe(false);
    });

    it('should reset progress to 0 when upload starts', () => {
      const stateWithProgress = {
        ...initialState,
        uploadProgress: 50,
      };
      const action = { type: uploadPhotos.pending.type };
      const state = memoryReducer(stateWithProgress, action);
      expect(state.uploadProgress).toBe(0);
    });

    it('should reset progress to 0 when upload fails', () => {
      const stateWithProgress = {
        ...initialState,
        uploadProgress: 75,
        isLoading: true,
      };
      const action = {
        type: uploadPhotos.rejected.type,
        payload: 'Upload failed',
      };
      const state = memoryReducer(stateWithProgress, action);
      expect(state.uploadProgress).toBe(0);
    });

    it('should preserve progress when other operations occur', () => {
      const stateWithProgress = {
        ...initialState,
        uploadProgress: 50,
      };

      // Get albums should not affect progress
      let state = memoryReducer(stateWithProgress, { type: getAlbums.pending.type });
      expect(state.uploadProgress).toBe(50);

      state = memoryReducer(state, {
        type: getAlbums.fulfilled.type,
        payload: [{ id: 'album-1', name: 'Test' }],
      });
      expect(state.uploadProgress).toBe(50);

      // Create memory should not affect progress
      state = memoryReducer(state, { type: createMemory.pending.type });
      expect(state.uploadProgress).toBe(50);

      state = memoryReducer(state, {
        type: createMemory.fulfilled.type,
        payload: { id: 'memory-1', description: 'Test' },
      });
      expect(state.uploadProgress).toBe(50);
    });
  });
});