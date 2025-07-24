import ChannelComment from './components/ChannelComment';
import Cruitmember from './components/Cruitmember';
import S from './StudyJoinInfomation.module.css'



function StudyJoinInfomation() {
  return (
    <main className={S.container}>
      <div className={S.layout}>
        <div className={S.channelInfoBox}>
          <img src="images/thumb.png" alt="" />
          <div className={S.textInfo}>
            <div className={S.title}>
              <h2>Lorem Ipsum</h2>
              <button>
                <svg
                  width="32"
                  height="48"
                  viewBox="0 0 15 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.4209 0.150391H12.4209C13.4381 0.150391 14.2705 0.982843 14.2705 2V17.7715L7.48047 14.8623L7.4209 14.8369L7.36133 14.8623L0.571289 17.7715L0.581055 2C0.581055 0.981862 1.40472 0.150391 2.4209 0.150391Z"
                    stroke="#222222"
                    stroke-width="0.3"
                  />
                </svg>
              </button>
            </div>
            <div className={S.tagBox}>
              #태그 #태그 #태그{" "}
              <span>
                <svg
                  width="3"
                  height="3"
                  viewBox="0 0 3 3"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.50935 2.55176C0.948598 2.55176 0.5 2.10316 0.5 1.5611C0.5 1.00036 0.948598 0.551758 1.50935 0.551758C2.0514 0.551758 2.5 1.00036 2.5 1.5611C2.5 2.10316 2.0514 2.55176 1.50935 2.55176Z"
                    fill="#555555"
                    fill-opacity="0.7"
                  />
                </svg>
              </span>{" "}
              지역{" "}
              <span>
                <svg
                  width="3"
                  height="3"
                  viewBox="0 0 3 3"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.50935 2.55176C0.948598 2.55176 0.5 2.10316 0.5 1.5611C0.5 1.00036 0.948598 0.551758 1.50935 0.551758C2.0514 0.551758 2.5 1.00036 2.5 1.5611C2.5 2.10316 2.0514 2.55176 1.50935 2.55176Z"
                    fill="#555555"
                    fill-opacity="0.7"
                  />
                </svg>
              </span>
              <span>
                <svg
                  width="12"
                  height="14"
                  viewBox="0 0 12 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="5.87206"
                    cy="4.18212"
                    r="2.81395"
                    fill="#555555"
                    fill-opacity="0.5"
                  />
                  <path
                    d="M0.244141 9.74024C0.244141 8.63567 1.13957 7.74023 2.24414 7.74023H9.49995C10.6045 7.74023 11.4999 8.63566 11.4999 9.74023V13.3681H0.244141V9.74024Z"
                    fill="#555555"
                    fill-opacity="0.5"
                  />
                </svg>
              </span>
              4
            </div>
          </div>
        </div>
        <article className={S.content}>
          Lorem Ipsum has been the industry's standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it
          to make a type specimen book. It has survived not only five centuries,
          but also the leap into electronic typesetting, remaining essentially
          unchanged. It was popularised in the 1960s with the release of
          Letraset sheets containing Lorem Ipsum passages, and more recently
          with desktop publishing software like Aldus PageMaker including
          versions of Lorem Ipsum Lorem Ipsum has been the industry's standard
          dummy text ever since the 1500s, when an unknown printer took a galley
          of type and scrambled it to make a type specimen book. It has survived
          not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in
          the 1960s with the release of Letraset sheets containing Lorem Ipsum
          passages, and more recently with desktop publishing software like
          Aldus PageMaker including versions of Lorem Ipsum
          <br />
          <br />
          Lorem Ipsum has been the industry's standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it
          to make a type specimen book. It has survived not only five centuries,
          but also the leap into electronic typesetting, remaining essentially
          unchanged. It was popularised in the 1960s with the release of
          Letraset sheets containing Lorem Ipsum passages, and more recently
          with desktop publishing software like Aldus PageMaker including
          versions of Lorem Ipsum Lorem Ipsum has been the industry's standard
          dummy text ever since the 1500s, when an unknown printer took a galley
          of type and scrambled it to make a type specimen book. It has survived
          not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in
          the 1960s with the release of Letraset sheets containing Lorem Ipsum
          passages, and more recently with desktop publishing software like
          Aldus PageMaker including versions of Lorem Ipsum
        </article>
        <Cruitmember />
        <ChannelComment />
      </div>
    </main>
  );
}
export default StudyJoinInfomation