import { gql } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/client/react'
import './App.css'

const GET_RELEASES = gql`
  query GetReleases {
    releases {
      id
      name
      dueDate
      status
      additionalInfo
      steps {
        id
        title
        completed
      }
    }
  }
`

const CREATE_RELEASE = gql`
  mutation CreateRelease(
    $name: String!
    $dueDate: String!
    $additionalInfo: String
  ) {
    createRelease(
      name: $name
      dueDate: $dueDate
      additionalInfo: $additionalInfo
    ) {
      id
      name
      dueDate
      status
      additionalInfo
      steps {
        id
        title
        completed
      }
    }
  }
`

const UPDATE_CHECKLIST_STEP = gql`
  mutation UpdateChecklistStep(
    $releaseId: ID!
    $stepId: ID!
    $completed: Boolean!
  ) {
    updateChecklistStep(
      releaseId: $releaseId
      stepId: $stepId
      completed: $completed
    ) {
      id
      name
      dueDate
      status
      additionalInfo
      steps {
        id
        title
        completed
      }
    }
  }
`

const UPDATE_RELEASE_INFO = gql`
  mutation UpdateReleaseInfo(
    $releaseId: ID!
    $additionalInfo: String
  ) {
    updateReleaseInfo(
      releaseId: $releaseId
      additionalInfo: $additionalInfo
    ) {
      id
      name
      dueDate
      status
      additionalInfo
      steps {
        id
        title
        completed
      }
    }
  }
`

const DELETE_RELEASE = gql`
  mutation DeleteRelease($releaseId: ID!) {
    deleteRelease(releaseId: $releaseId)
  }
`

function App() {
  const { loading, error, data } = useQuery(GET_RELEASES)

  const [createRelease, { loading: creating }] = useMutation(
    CREATE_RELEASE,
    {
      refetchQueries: [{ query: GET_RELEASES }],
    }
  )

  const [updateChecklistStep] = useMutation(
    UPDATE_CHECKLIST_STEP,
    {
      refetchQueries: [{ query: GET_RELEASES }],
    }
  )

  const [updateReleaseInfo] = useMutation(
    UPDATE_RELEASE_INFO,
    {
      refetchQueries: [{ query: GET_RELEASES }],
    }
  )

  const [deleteRelease, { loading: deleting }] = useMutation(
    DELETE_RELEASE,
    {
      refetchQueries: [{ query: GET_RELEASES }],
    }
  )

  const handleSubmit = async (event) => {
    event.preventDefault()

    const form = event.target

    const name = form.name.value
    const dueDate = form.dueDate.value
    const additionalInfo = form.additionalInfo.value

    try {
      await createRelease({
        variables: {
          name,
          dueDate: new Date(dueDate).toISOString(),
          additionalInfo: additionalInfo || null,
        },
      })

      form.reset()

      alert('Release created successfully!')
    } catch (error) {
      alert(error.message)
    }
  }

  const handleChecklistChange = async (
    releaseId,
    stepId,
    completed
  ) => {
    try {
      await updateChecklistStep({
        variables: {
          releaseId,
          stepId,
          completed,
        },
      })
    } catch (error) {
      alert(error.message)
    }
  }

  const handleInfoUpdate = async (
    releaseId,
    additionalInfo
  ) => {
    try {
      await updateReleaseInfo({
        variables: {
          releaseId,
          additionalInfo: additionalInfo || null,
        },
      })

      alert('Information updated successfully!')
    } catch (error) {
      alert(error.message)
    }
  }

  const handleDelete = async (releaseId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this release?'
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteRelease({
        variables: {
          releaseId,
        },
      })

      alert('Release deleted successfully!')
    } catch (error) {
      alert(error.message)
    }
  }

  if (loading) {
    return <h1>Loading releases...</h1>
  }

  if (error) {
    return <h1>Error: {error.message}</h1>
  }

  return (
    <div className="app">
      <header>
        <h1>ReleaseCheck</h1>
        <p>Release checklist management tool</p>
      </header>

      <main>
        <section className="create-release">
          <h2>Create Release</h2>

          <form onSubmit={handleSubmit}>
            <div>
              <label>Release Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter release name"
                required
              />
            </div>

            <div>
              <label>Due Date</label>

              <input
                type="datetime-local"
                name="dueDate"
                required
              />
            </div>

            <div>
              <label>Additional Information</label>

              <textarea
                name="additionalInfo"
                placeholder="Optional information"
                rows="4"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
            >
              {creating
                ? 'Creating...'
                : 'Create Release'}
            </button>
          </form>
        </section>

        <section>
          <h2>Releases</h2>

          {data.releases.length === 0 ? (
            <p>No releases found.</p>
          ) : (
            data.releases.map((release) => (
              <div
                className="release-card"
                key={release.id}
              >
                <h3>{release.name}</h3>

                <p>
                  <strong>Due:</strong>{' '}
                  {new Date(
                    release.dueDate
                  ).toLocaleString()}
                </p>

                <p>
                  <strong>Status:</strong>{' '}
                  {release.status}
                </p>

                <div>
                  <strong>Additional Information:</strong>

                  <textarea
                    defaultValue={
                      release.additionalInfo || ''
                    }
                    placeholder="Add or update information"
                    rows="3"
                    id={`info-${release.id}`}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      const textarea =
                        document.getElementById(
                          `info-${release.id}`
                        )

                      handleInfoUpdate(
                        release.id,
                        textarea.value
                      )
                    }}
                  >
                    Save Information
                  </button>
                </div>

                <h4>Checklist</h4>

                <ul>
                  {release.steps.map((step) => (
                    <li key={step.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={step.completed}
                          onChange={(event) =>
                            handleChecklistChange(
                              release.id,
                              step.id,
                              event.target.checked
                            )
                          }
                        />

                        {' '}

                        {step.title}
                      </label>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(release.id)
                  }
                  disabled={deleting}
                >
                  {deleting
                    ? 'Deleting...'
                    : 'Delete Release'}
                </button>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  )
}

export default App